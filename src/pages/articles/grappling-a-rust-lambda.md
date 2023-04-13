---
layout: ../../layouts/Article.astro
title: Grappling a Rust Lambda 🦀
author: Matthew Cobbing
description: "How I (eventually) got a Rust Lambda to cross-compile using Cargo Lambda."
image:
  url: "https://images.unsplash.com/photo-1610070925534-623b9872918e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&fm=jpg&w=700&fit=max"
  alt: "Rust"
pubDate: 2023-04-12T09:00:00.000Z
---

##

At Perkbox we have a small amount of Rust lambdas. We find Rust a compelling choice for lambdas due its performance, safety features, and fast cold starts.

To build our functions, we use [cargo-lambda](https://www.cargo-lambda.info/), and at some point the subcommand started to use cargo-zigbuild as the default compiler to cross-compile to a Linux target. This caused issues when trying to deploy a lambda after trying to update the Rust version.

## Debugging

After updating the Rust version to v1.67 and leaving cargo-lambda as v0.4.0 the pipeline actually compiled.

The integration tests failed unexpectedly though and I noticed this error in the lambda logs:

```sh
version `GLIBC_2.28` not found
```

From that and some googling, I gauged that cross compiling the lambdas was no longer working correctly, so I decided to update cargo-lambda to 0.18.1.

Our lambdas have the x86_64 architecture so we need the x86_64-unknown-linux-gnu target.

We use a custom build image to build rust lambdas that does not include zig, and as this version of cargo-lambda uses zig, the pipeline failed when trying to build the lambdas.

```sh
   Installed package `cargo-lambda v0.18.1` (executable `cargo-lambda`)
Zig is not installed in your system.
You can use any of the following options to install it:
	* Install with Pip3 (Python 3): `pip3 install ziglang`
	* Install with NPM: `npm install -g @ziglang/cli`
	* Download Zig 0.9.1 or newer from https://ziglang.org/download/ and add it to your PATH
Error:
  × install Zig and run cargo-lambda again
```

In gitlab-ci we use a custom Alpine Linux build image, which doesn't provide any convenient ways to install zig, so I decided to try and use cargo as the compiler as stated on the cargo-lambda website.

```sh
cargo lambda build --compiler cargo
```

This did not work. I received an error that looked above my pay grade.

```sh
error[E0463]: can't find crate for `core`
  |
  = note: the `aarch64-unknown-linux-gnu` target may not be installed
  = help: consider downloading the target with `rustup target add aarch64-unknown-linux-gnu`
error[E0463]: can't find crate for `compiler_builtins`
error[E0432]: unresolved import `ffi::c_void`
    --> /builds/perkbox-services/lambda/lambda/.cargo/registry/src/github.com-1ecc6299db9ec823/libc-0.2.131/src/unix/mod.rs:1513:17
     |
1513 |         pub use ::ffi::c_void;
     |                 ^^^^^^^^^^^^^
```

That error convinced me to try and install zig.

I tried to install using pip, but for some reason after installing, the pipeline just wouldn't find it, so I ended up downloading the executable directly and adding it to PATH.

```sh
wget https://ziglang.org/download/0.10.1/zig-linux-x86_64-0.10.1.tar.xz
tar -xf zig-linux-x86_64-0.10.1.tar.xz
sudo mv zig-linux-x86_64-0.10.1/* /usr/local/bin
```

That actually solved the issue. The build worked and the lambda was deployed correctly 🎉.

Reading this it doesn't seem too bad, but this caused me such a headache at the time I felt it warranted me posting about it.

## Solution

Here is the `gitlab-ci` pipeline that finally got lambdas to work.

```yaml
build-and-test:
  stage: test
  image: rust
  variables:
    CARGO_HOME: "${CI_PROJECT_DIR}/.cargo"
    SCCACHE_BUCKET: "gitlab-runner-cache-1"
    SCCACHE_S3_KEY_PREFIX: "sccache"
    RUSTC_WRAPPER: "sccache"
  script: |
    export PATH="${CARGO_HOME}/bin:$PATH"
    wget https://ziglang.org/download/0.10.1/zig-linux-x86_64-0.10.1.tar.xz
    tar -xf zig-linux-x86_64-0.10.1.tar.xz
    sudo mv zig-linux-x86_64-0.10.1/* /usr/local/bin
    zig --help
    rustup target add x86_64-unknown-linux-gnu
    cargo install cargo-lambda --version 0.18.1
    cargo lambda build --release --target x86_64-unknown-linux-gnu
    cargo install cargo-tarpaulin
    cargo tarpaulin -v --run-types Lib --ignore-tests --out Html Xml --output-dir ${CI_PROJECT_DIR}/test-report
    rm -rf pkg && mkdir pkg
    zip -j ./pkg/lambda.zip target/lambda/lambda/bootstrap
```
