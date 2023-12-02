---
layout: ../../layouts/Article.astro
title: Advent of Code 23
author: Matthew Cobbing
description: "I participated in the advent of code 2023"
image:
  url: "https://images.unsplash.com/photo-1513297887119-d46091b24bfa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&fm=jpg&w=700&fit=max"
  alt: "Christmas tree"
pubDate: 2023-12-01T09:00:00.000Z
draft: false
---

##

I have known about the advent of code for a while now but this is my first time participating.

The advent of code is an advent calendar, but instead of chocolates you solve a daily programming challenge.

This year I will attempt to solve the challenges using the elixir programming language.

## Day 2

### Part 1

In second day challenge we were given a list of games where an elf showed random coloured cubes from a bag.

```
Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green
```

The elf then wanted to know which games would have been possible if the bag contained only 12 red cubes, 13 green cubes, and 14 blue cubes.

This was my solution:

```elixir
  def part1({input, {red, green, blue}}) do
    input
    |> String.split("\n")
    |> Enum.filter(fn line -> line != "" end)
    |> Enum.map(fn line -> String.replace_prefix(line, "Game ", "") |> String.split(": ") end)
    |> Enum.map(fn [game, cubes] -> {String.to_integer(game), String.split(cubes, "; ")} end)
    |> Enum.map(fn {game, sets} ->
      {game,
       sets
       |> Enum.map(fn set ->
         String.split(set, ", ")
         |> Enum.map(fn cubes ->
           [amount, colour] = String.split(cubes, " ")
           {String.to_integer(amount), colour}
         end)
         |> Enum.map(fn {amount, colour} ->
           case colour do
             "red" -> amount <= red
             "blue" -> amount <= blue
             "green" -> amount <= green
           end
         end)
       end)}
    end)
    |> Enum.map(fn {game, sets} -> {game, List.flatten(sets) |> Enum.member?(false)} end)
    |> Enum.filter(fn {_game, impossible} -> !impossible end)
    |> Enum.reduce(0, fn {game, _}, acc -> game + acc end)
  end
```

## Part 2

The second part was to find the lowest amount of cubes that was possible to play each game.

The was the key piece of code:

```elixir
      |> Enum.reduce({0, 0, 0}, fn {amount, colour}, {red, green, blue} ->
        case colour do
          "red" -> {Kernel.max(red, amount), green, blue}
          "green" -> {red, Kernel.max(green, amount), blue}
          "blue" -> {red, green, Kernel.max(blue, amount)}
        end
      end)
```

I have noticed I am doing some silly things like use a reduce instead of sum but overall I am really enjoying using elixir.
The pipe operator feels very similar to using rust and having rust experience has been helpful here 🦀; maybe I am using it way too much because of this.

## Day 1

### Part 1

The first challenge is to get the first and last number of each line in a list, concatenate the numbers together and then calculate the sum of the lines.

For example:
```
1abc2
pqr3stu8vwx
a1b2c3d4e5f
treb7uchet
```

In this example, the values of these four lines are 12, 38, 15, and 77. Adding these together produces 142.

I started by splitting the input string into lines and filtering non empty lines.
The lines could then be split into characters and the characters then parsed into integers. Non numeric characters could be discarded by filtering errors.
I used the `Enum.at` function to get the first and last numbers from the list (with an index of -1 for the last number).
After that it was a case of concatenating the numbers and adding them all together...

This was my solution:

```elixir
  def part1(args) do
    args
    |> String.split("\n")
    |> Enum.filter(fn line -> line != "" end)
    |> Enum.map(fn line ->
      line
      |> String.graphemes()
      |> Enum.map(fn c -> c |> Integer.parse() end)
      |> Enum.filter(fn result -> result != :error end)
      |> Enum.map(fn {value, _} -> value end)
    end)
    |> Enum.map(fn numbers -> {Enum.at(numbers, 0), Enum.at(numbers, -1)} end)
    |> Enum.map(fn {first, last} ->
      Integer.to_string(first) <> Integer.to_string(last)
    end)
    |> Enum.map(fn number -> number |> Integer.parse() end)
    |> Enum.map(fn {value, _} -> value end)
    |> Enum.reduce(0, &+/2)
  end
```

It worked! 

Even I can tell this isn't the best elixir in the world but I've got 24 days left to sort that out.

### Part 2

The second part was very similar but each line could also include worded digits e.g. one, two, three, four, five, six, seven, eight, and nine.

For example:

```
two1nine
eightwothree
abcone2threexyz
xtwone3four
4nineeightseven2
zoneight234
7pqrstsixteen
```

I used the same code as part one but I used a simple replace function on every line to replace a worded digit for the corresponding integer.
This almost worked straight away but I has an issue where some worded digits could share the letters. 
For example, on line two, eight and two both share the letter 't'. After replacing 'two' with '2', 'eight' was 'eigh' 😅.
I fixed that with:

```elixir
    |> Enum.map(fn line ->
      line
      |> String.replace("one", "one1one")
      |> String.replace("two", "two2two")
      |> String.replace("three", "three3three")
      |> String.replace("four", "four4four")
      |> String.replace("five", "five5five")
      |> String.replace("six", "six6six")
      |> String.replace("seven", "seven7seven")
      |> String.replace("eight", "eight8eight")
      |> String.replace("nine", "nine9nine")
    end)
```
