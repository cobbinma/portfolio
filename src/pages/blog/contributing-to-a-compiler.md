---
layout: ../../layouts/Article.astro
title: Contributing to a Compiler
author: Matthew Cobbing
description: "Through the Compiler Looking-glass and what I found."
image:
  url: "https://images.unsplash.com/photo-1496247749665-49cf5b1022e9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&fm=jpg&w=700&fit=max"
  alt: "Heavy industry"
pubDate: 2023-04-14T09:00:00.000Z
---

##

I have been writing software professionally for about six years and until recently the process of turning code into something that the computer understood was always a bit of a mysterious black box.

A compiler is a program that turns code into machine code. For whatever reason, I had the preconceived belief that compilers would be complex and obscure. I thought that understanding and programming compilers should be reserved for the engineering wizards and 10x developers.

That all changed when someone recommended [Crafting Interpreters](https://craftinginterpreters.com/) by Robert Nystrom.

The book takes a single language named Lox and implements two interpreters for the language, firstly in Java, and then in a version in C that is compiled into byte code and run on a virtual machine.

After following the book through the first version of the interpreter, I wanted to see if I could apply what I had learned and understand how a more complex programming language interpreted its source code.

[Go](https://github.com/golang/go) and [Rust](https://github.com/rust-lang/rust) are the languages I have the most experience with, but they have 2.8 million and 3.2 million lines of code in their repositories, respectively. With my limited knowledge of compilers, I wanted to find a language that would be easier to understand.

[Gleam](https://github.com/gleam-lang/gleam) is a statically typed and impure functional programming language that compiles to Erlang (or Javascript). I had a small amount of Elixir experience, so the syntax was fairly familiar to me, and I found the premise really compelling. Its repository has less than 100,000 lines of code and is written in Rust! 🦀

I started to look around Gleam's source code, trying to understand it by comparing the code against the examples I had read in Crafting Interpreters. I found the code clean and very readable. I began to focus on particular sections at a time. I would look back at chapters in the book and then try to find the corresponding sections of code in the Gleam repository. By doing this, I gained enough confidence and decided it was time to try and tackle an issue.

There was an issue titled 'Permit type holes in function argument and return annotations' where the following code would be wrongly rejected:

```gleam
pub fn run(args: List(_)) -> Option(_) {
  todo
}
```

The issue had 'good first issue' and 'help wanted' tags, so I looked into it, not exactly confident I would find a solution.

I started by adding a failing test by copying an already existing test and adding the code from the issue.

```rust
// https://github.com/gleam-lang/gleam/issues/1519
#[test]
fn permit_holes_in_fn_args_and_returns() {
    assert_module_infer!(
        "pub fn run(args: List(_)) -> List(_) {
  todo
}",
        vec![("run", "fn(List(a)) -> List(b)")],
    );
}
```

By doing that, I could narrow down the issue somewhat. To be honest I didn't really understand what the section of code was doing exactly, so started to see what methods I could call on the variables and, after some aimless digging, I found a 'permit_holes' method on a hydrator variable...

```rust
hydrator.permit_holes(true);
```

![](https://media.giphy.com/media/3oEduNITi4GfwxY1Fu/giphy.gif)

All the tests passed after adding that line of code. Without fully knowing how and still with a lot of skepticism... had I just fixed the issue?

I created a pull request with the changes. The creator of the language quickly replied, and to my surprise, he said the changes were clean and asked me to add a line to the changelog. After doing that, the pull request was approved and I merged!

Since my first commit, I have continued to contribute to the repository. Mostly making simple changes to the formatter. Going forward, I would like to start making more significant contributions to the code base. The language's community seems extremely friendly and supportive. I'm excited to see where the language goes from here.

I also want to continue learning about compilers, it's an area of Software Engineering that I find really rewarding and enjoy working in.
