---
layout: ../../layouts/MarkdownPostLayout.astro
title: Using Dependency Inversion in Go
author: Matthew Cobbing
description: "We use Kanye West to explore how to implement dependency inversion in the go programming language."
image:
  url: "https://images.unsplash.com/photo-1473396413399-6717ef7c4093?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&fm=jpg&w=700&fit=max"
  alt: "Kanye"
pubDate: 2019-09-07T09:00:00.000Z
tags: ["go", "rust"]
---

## What is Dependency Inversion?

Dependency Inversion is the idea that high-level logic should not depend on its low-level implementations. Business logic in our application should not care about whether we get data from an AWS bucket or Google Cloud Storage; we should be able to easily swap these implementations without our program breaking. This makes our code stable against change. We can also make our application testable by swapping these dependencies for implementations that are easier to test.

## How is this done in Go?

In Go, interfaces enable us to use dependency inversion. We are able to use different implementations in our code, as long as they satisfy the interface we have defined. We use dependency injection to tell the application which implementation to use.

## Worked Example

To demonstrate how this works in Go we’re going to build upon a Quote API that provides random quotes to our users. Below is a screenshot of our current Go handler that provides Kanye West quotes.

```go
package handlers

import (
	"encoding/json"
	"github.com/cobbinma/kanye-west-api/models"
	"io/ioutil"
	"net/http"
)

func Kanye(w http.ResponseWriter, r *http.Request) {
	resp, err := http.Get("https://api.kanye.rest/")
	if err != nil {
		_, _ = w.Write([]byte("error getting kanye quote"))
		return
	}

	if resp == nil || resp.StatusCode != http.StatusOK {
		_, _ = w.Write([]byte("bad kanye response"))
		return
	}

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		_, _ = w.Write([]byte("bad kanye body"))
		return
	}

	var quote models.Quote
	err = json.Unmarshal(body, &quote)
	if err != nil {
		_, _ = w.Write([]byte("could not marshall kanye"))
		return
	}

	_, _ = w.Write([]byte(quote.Quote))
}
```

This handler does a perfectly good job of giving a user Kanye West quotes; it’s what you might expect when you first write a HTTP handler in Go. It makes a HTTP call to https://api.kanye.rest which provides the quote and checks the response is valid. When you call the handler, you will receive a response with a quote:

![](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*jKKo-2uUdLddM5UoGrOZCg.png)

We would however like to start testing the handler but currently have no way of doing that without making actual HTTP calls. We also have no way of testing what happens when our dependency returns a bad response. This is where we can start using dependency inversion.

We first need to create an interface, this will define the behaviour of our dependency. By doing this we will later be able to swap in different implementations as long as they share the same behaviour. This is our interface:

```go
type Client interface {
	Get(string) (*http.Response, error)
}
```

Any struct that has a method called ‘Get’ that takes a string as an argument and returns a pointer to a response type from the net/http package with an error, will fulfil the Client interface. This is the behaviour we are interested in.

Now we need a way of injecting the dependency into the handler to make it agnostic to whatever implementation of the Client interface we choose to use. There are many approaches of dependency injection in Go. I will outline a few below:

### Higher Order Function

We could create a higher-order function that returned our original handler function. This is convenient as you only need to call the higher order function with what you need to use, we also do not need to create a handler struct.

```go
func Kanye(client Client) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		resp, err := client.Get("https://api.kanye.rest/")
		if err != nil {
			_, _ = w.Write([]byte("error getting kanye quote"))
			return
		}
```

Our HTTP dependency is then injected from our main function by calling the higher-order function.

```go
func main() {
	r := mux.NewRouter()
	client := http.DefaultClient
	r.HandleFunc("/kanye", handlers.Kanye(client))
	log.Println("serving quotes...")
	log.Fatal(http.ListenAndServe(":2024", r))
}
```

### Constructor

We can create a ‘handlers’ struct, which has a constructor function where we supply the client implementation. The handlers struct has a field called client which is where our implementation is stored.

```go
package handlers

type handlers struct {
	client Client
}

func NewHandlers(client Client) *handlers {
	return &handlers{client: client}
}
```

By making the Kanye function a handlers receiver method, we can access the client field.

```go
func (h *handlers) Kanye(w http.ResponseWriter, r *http.Request) {
	resp, err := h.client.Get("https://api.kanye.rest/")
	if err != nil {
		_, _ = w.Write([]byte("error getting kanye quote"))
		return
	}
```

We then inject the HTTP client from the main function by constructing the handlers struct with the correct dependencies.

A disadvantage of this approach is that, when used a lot it can make you construct a lot of structs in your main file.

```go
func main() {
	r := mux.NewRouter()
	h := handlers.NewHandlers(http.DefaultClient)
	r.HandleFunc("/kanye", h.Kanye)
	log.Println("serving quotes...")
	log.Fatal(http.ListenAndServe(":2024", r))
}
```

### Using Options

Another approach is to use options in our handlers constructor. In this approach we set a default implementation to use unless the user gives an alternative as an option. The handlers constructor would be a variadic function, so that either options can be given to it or not. In the example below we export a higher order option function WithCustomClient, to make it easy for the user to use an alternative Client implementation.

```go
package handlers

import "net/http"

type handlers struct {
	client Client
}

type handlerOptions struct {
	client Client
}

func WithCustomClient(client Client) func(*handlerOptions) *handlerOptions {
	return func(ho *handlerOptions) *handlerOptions {
		ho.client = client
		return ho
	}
}

func NewHandlers(options ...func(*handlerOptions) *handlerOptions) *handlers {
	opts := &handlerOptions{
		client: http.DefaultClient,
	}
	for i := range options {
		opts = options[i](opts)
	}
	return &handlers{
		client: opts.client,
	}
}
```

Using the constructor we can now use the default implementation (http.DefaultClient) by calling NewHandlers without any arguments:

```go
h := handlers.NewHandlers()
```

Or we can call it with a custom Client option to use a non-default:

```go
h := handlers.NewHandlers(handlers.WithCustomClient(&http.Client{
		Timeout: time.Duration(time.Second * 10),
	}))
```

Using this approach, when you want to use a default implementation, you do not need to construct those implementations yourself which can leave your main file less convoluted.

### Test Implementation

Now we have covered the different dependency injection approaches, we will create an implementation of the Client interface to be used in test. From here we will use higher order functions to inject dependency.

At this point we could either write a test double ourselves or use GoMock to generate an implementation that allows us to control its behaviour though stubbing. For this example, we will use GoMock.

By adding the line of code below into our code base we can automatically generate a test double from the Client interface.

```go
//go:generate mockgen -package=mock -destination=./mock/client.go -source=client.go
type Client interface {
	Get(string) (*http.Response, error)
}
```

By running go generate ./… we generate the following code:

```go
// Code generated by MockGen. DO NOT EDIT.
// Source: client.go

// Package mock is a generated GoMock package.
package mock

import (
	gomock "github.com/golang/mock/gomock"
	http "net/http"
	reflect "reflect"
)

// MockClient is a mock of Client interface
type MockClient struct {
	ctrl     *gomock.Controller
	recorder *MockClientMockRecorder
}

// MockClientMockRecorder is the mock recorder for MockClient
type MockClientMockRecorder struct {
	mock *MockClient
}

// NewMockClient creates a new mock instance
func NewMockClient(ctrl *gomock.Controller) *MockClient {
	mock := &MockClient{ctrl: ctrl}
	mock.recorder = &MockClientMockRecorder{mock}
	return mock
}

// EXPECT returns an object that allows the caller to indicate expected use
func (m *MockClient) EXPECT() *MockClientMockRecorder {
	return m.recorder
}

// Get mocks base method
func (m *MockClient) Get(arg0 string) (*http.Response, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "Get", arg0)
	ret0, _ := ret[0].(*http.Response)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// Get indicates an expected call of Get
func (mr *MockClientMockRecorder) Get(arg0 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "Get", reflect.TypeOf((*MockClient)(nil).Get), arg0)
}
```

This is an implementation of Client we can use in tests. We can inject this, instead of the default HTTP client and mock the behaviour of making real HTTP Get calls to the Kanye API. We are now able to write tests without making HTTP calls and test what happens when we get a bad response.

Below is an example of the type of test case we can now write. The test uses Ginkgo, a Behaviour Driven Development Testing Framework.

```go
package handlers_test

import (
	"fmt"
	"github.com/cobbinma/kanye-west-api/cmd/handlers"
	"github.com/cobbinma/kanye-west-api/cmd/handlers/mock"
	"github.com/golang/mock/gomock"
	. "github.com/onsi/ginkgo"
	. "github.com/onsi/gomega"
	"io/ioutil"
	"net/http"
	"net/http/httptest"
	"strings"
)

var _ = Describe("Handlers", func() {
	var (
		ctrl   *gomock.Controller
		client *mock.MockClient
	)
	BeforeEach(func() {
		ctrl = gomock.NewController(GinkgoT())
		client = mock.NewMockClient(ctrl)
	})
	When("Kanye Handler is called", func() {
		When("a valid response is received", func() {
			quote := "Perhaps I should have been more like water today"
			body := fmt.Sprintf(`{"quote":"%s"}`, quote)
			resp := &http.Response{
				StatusCode: http.StatusOK,
				Body:       ioutil.NopCloser(strings.NewReader(body)),
			}
			BeforeEach(func() {
				client.EXPECT().Get(gomock.Eq("https://api.kanye.rest/")).Return(resp, nil)
			})

			It("should return HTTP status of OK and correct quote", func() {
				req, _ := http.NewRequest("GET", "/kanye", nil)
				rr := httptest.NewRecorder()
				handler := http.HandlerFunc(handlers.Kanye(client))
				handler.ServeHTTP(rr, req)

				Expect(rr.Code).To(Equal(http.StatusOK))
				Expect(rr.Body.String()).To(Equal(quote))
			})
		})
	})
})
```

The test case stubs the mock client implementation. We check it is called with the correct URL string and tell it to return our HTTP response without an error. We can check that the HTTP status code and the quote sent to the user are as we expect.

## Conclusion

We have covered how to use dependency inversion to alter our handler so that it can be used with any implementation of Client. This technique can be applied to any type of dependency.

Dependency Inversion can be a powerful tool to create programs that are more stable and robust as features are added to it. We can create tests that mock dependencies and by depending on a concept rather than an implementation, we reduce the amount of change to business logic.

If you want to read more about dependency inversion, I highly recommend Clean Architecture by Robert C Martin. https://www.goodreads.com/book/show/18043011-clean-architecture

All the code examples can be found here:

https://github.com/cobbinma/quotes
