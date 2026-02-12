---
layout: ../../layouts/Article.astro
title: Mocking With Snapshots
author: Matthew Cobbing
description: "Speed up writing mock tests using snapshots."
image:
  url: "https://images.unsplash.com/photo-1488261938500-59f02128e747?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&fm=jpg&w=700&fit=max"
  alt: "Person taking photo of sunset"
pubDate: 2024-02-20T09:00:00.000Z
---

## Introduction

Combining snapshot testing with mocking can significantly accelerate development workflows.
By leveraging snapshots, developers can efficiently capture and compare expected arguments to mocked functionality.
This post will explore how to integrate these approaches effectively in a Go project.

> For this post I will shamelessly be using my own snapshot library [bromide](https://github.com/cobbinma/bromide) 📸.

## What is a mock?

Mocks are simulated objects used in tests to replicate the behavior of real components. 
They help isolate code being tested and verify interactions with external dependencies, making tests more focused and efficient.

By using Uber's [mock](https://github.com/uber-go/mock) library, we can generate mocks from interfaces that are otherwise implemented 
using code that is difficult to test.

For our example, we are going to mock the following interface:
```go
type Foo interface {
  Bar(x int) int
}
```

This is called by passing an implementation of the interface to a function named `SUT`.

```go
func SUT(f Foo) {
 // ...
}
```

And a test for `SUT` would look something like this:

```go
func TestFoo(t *testing.T) {
  ctrl := gomock.NewController(t)

  m := NewMockFoo(ctrl)

  m.
    EXPECT().
    Bar(gomock.Eq(99)).
    Return(101)

  SUT(m)
}
```

At the moment, we have to manually manage the expected arguments for our mock; 
this becomes increasingly difficult as our test grows and we start using more complex data types.

## What is snapshot testing?

Snapshot testing is a technique used in software testing where the output of a function or component is captured and stored as a 'snapshot'. 
Subsequent test runs will compare the current output with the stored snapshot to detect unexpected changes, helping ensure consistency and prevent regressions.

We can use [bromide](https://github.com/cobbinma/bromide) to create and manage snapshots used in go tests.

```go
func TestFoo(t *testing.T) {
    bromide.Snapshot(t, 99)
}
```

```
❯ go test ./...
?       github.com/cobbinma/bromide/cmd/bromide [no test files]
?       github.com/cobbinma/bromide/internal    [no test files]
--- FAIL: TestFoo (0.00s)
    bromide_test.go:43: new snapshot 📸
    bromide_test.go:43: to accept snapshot run `bromide`
FAIL
FAIL    github.com/cobbinma/bromide     0.187s
FAIL
```
After running the above test a snapshot file is generated, we can then review the pending snapshot and decide whether it is correct.

```
(int) 99
```

## Combining mocks with snapshots

So how can we speed up writing mock tests with snapshots?

If we look closely at the code in our mocking test we can see that the generated function `Bar` takes a function as an argument `gomock.Eq`.

```go
  m.
    EXPECT().
    Bar(gomock.Eq(99)).
    Return(101)
```

This `gomock.Eq` function implements a `Matcher` interface. 
As our `Bar` function accepts this interface, we can use other functions like `gomock.Any` to allow any argument in our test.

```go
// A Matcher is a representation of a class of values.
// It is used to represent the valid or expected arguments to a mocked method.
type Matcher interface {
	// Matches returns whether x is a match.
	Matches(x any) bool

	// String describes what the matcher matches.
	String() string
}
```

Let's try and create something that implements the `Matcher` interface so we can use it in our test, 
but uses snapshot testing to assert that the incoming argument matches the expected value.

```go
var _ gomock.Matcher = (*XMatcher)(nil)

type XMatcher struct {
	t    *testing.T
}

func NewXMatcher(t *testing.T) gomock.Matcher {
	return &XMatcher{t: t}
}

func (m *XMatcher) Matches(x any) bool {
	v := x.(int)

	bromide.Snapshot(m.t, v)

	return true
}

func (m *XMatcher) String() string {
	return "expected snapshot value"
}
```

We can use this matcher in our mocking test:
```go
func TestFoo(t *testing.T) {
  ctrl := gomock.NewController(t)

  m := NewMockFoo(ctrl)

  m.
    EXPECT().
    Bar(NewXMatcher(t)).
    Return(101)

  SUT(m)
}
```

Now, when `Foo` receives an unexpected argument, our snapshot library will fail our test due to a mismatch.
We can then use the [bromide](http://github.com/cobbinma/bromide) CLI tool to review any new or mismatched snapshots.
This speeds up developing and managing complex tests as we can use the snapshot library to update changes to our expected values
instead of manually checking differences between the expected and received arguments in test logs and then updating the test code.
