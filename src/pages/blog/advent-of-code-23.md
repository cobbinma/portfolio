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

I have known about the advent of code for a while now, but this is my first time participating.

The advent of code is an advent calendar, but instead of chocolates, you solve a daily programming challenge.

This year, I will attempt to solve the challenges using the Elixir programming language.

## Day 6

### Part 1

Day six was my best day yet. 🎉

```
Time:      7  15   30
Distance:  9  40  200
```

The example describes three races...

- The first race lasts 7 milliseconds. The record distance in this race is 9 millimeters.
- The second race lasts 15 milliseconds. The record distance in this race is 40 millimeters.
- The third race lasts 30 milliseconds. The record distance in this race is 200 millimeters.

Our boat has a starting speed of zero millimeters per millisecond. 
For each whole millisecond you spend at the beginning of the race holding down the button, the boat's speed increases by one millimeter per millisecond.

Since the current record for this race is 9 millimeters, there are actually 4 different ways we could win: we could hold the button for 2, 3, 4, or 5 milliseconds at the start of the race.

The task is to find the amount of different ways we could beat the record and then multiply those together.

```elixir
  def part1(input) do
    input
    |> String.split("\n", trim: true)
    |> Enum.map(fn row ->
      [_, values] = String.split(row, ":")
      values |> String.split(" ", trim: true) |> Enum.map(&String.to_integer/1)
    end)
    |> Enum.zip()
    |> Enum.map(fn {time, record} ->
      0..time
      |> Enum.filter(fn hold ->
        distance = (time - hold) * hold
        distance > record
      end)
    end)
    |> Enum.map(&length/1)
    |> Enum.reduce(1, fn wins, acc -> wins * acc end)
  end
```

I'm not sure if I'm slowly getting used to Elixir or if this one was a bit easier, but here's my solution to part one.

### Part 2

Part two was really similar, only the example now meant this:

```
Time:      71530
Distance:  940200
```

After yesterday, I thought the solution wouldn't be as simple as just removing the spaces.

```elixir
values |> String.replace(" ", "") |> String.to_integer()
```

But the program ran successfully, albeit slowly, and it gave me the correct result.

I'm not too interested in optimising my solutions if they work; this is only a bit of fun.

## Dat 5

### Part 1

On day five, we were given a mapping system that allows you to convert numbers from one to another.

The first line of the seed-to-soil map has a destination of 50, a source of 98, and a range of 2.
This means that a seed of 98 converts to 50, and a seed of 99 converts to 51. Seeds that aren't mapped stay the same.

```
seeds: 79 14 55 13

seed-to-soil map:
50 98 2
52 50 48

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15
```

See the below conversions for the seeds in the example above:

- Seed 79, soil 81, fertilizer 81.
- Seed 14, soil 14, fertilizer 53.
- Seed 55, soil 57, fertilizer 57.
- Seed 13, soil 13, fertilizer 52.

To solve this, I first parsed the input into seeds and maps, where seeds are an array and maps are maps with destination, source, and range keys.
Then I used a big reduce function to loop the maps over the seeds.
I was also able to use `reduce_while` to loop over the individual seeds.

```elixir
Enum.reduce(maps, seeds, fn mappings, seeds ->
  seeds
  |> Enum.map(fn seed ->
    Enum.reduce_while(mappings, seed, fn mapping, seed ->
      if(
        mapping.destination > mapping.source && seed >= mapping.source &&
          seed <= mapping.source + mapping.range
      ) do
        {:halt, seed + (mapping.destination - mapping.source)}
      else
        if(
          mapping.source > mapping.destination && seed >= mapping.source &&
            seed <= mapping.source + mapping.range
        ) do
          {:halt, seed - (mapping.source - mapping.destination)}
        else
          {:cont, seed}
        end
      end
    end)
  end)
end)
|> Enum.min()
```

### Part 2

Part two was exactly the same, only the seeds in the input now represented a range of values instead of specific values.
The first value is now the start value, and the second value is the range.
The first two values in the example represent all of the numbers between 79 and 93.

```
seeds: 79 14 55 13
```

I started to solve this by just making the seed array include all of these values.

```elixir
 |> Enum.chunk_every(2)
 |> Enum.flat_map(fn [start, range] ->
   Enum.reduce(0..(range - 1), [], fn index, acc ->
     [start + index | acc]
   end)
 end),
```

This actually passed the given example however, when I ran for my actual input, the program ran indefinately.

I will have to fix this by doing some kind of optimisation, but I'll have to get around to this later.

## Day 4

### Part 1

Today we were given cards, where each card has winning numbers and guesses.

If a guess matches a winning number, that guess is a winning number. A card gets 1 point for the first match.
then the score is doubled for each winning number after that.

This was the given example:

```
Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11
```

I am finding these challenges involve a lot of parsing.
Elixir doesn't have the same level of help as Rust for parsing, so it's taking me a bit of time to get used to it.

The biggest challenge in part one was the point calculation.

```elixir
|> Enum.map(fn {winners, numbers} ->
  amount =
    numbers
    |> Enum.filter(fn number -> Enum.member?(winners, number) end)
    |> length()

  case amount do
    0 -> 0
    other -> Integer.pow(2, other - 1)
  end
end)
```

### Part 2

Part two nearly killed me on day four.

A winning card now means you win 'copies' of other cards.

For the example in part one, card 1 has four matching numbers, so you win one copy each of the next four cards: cards 2, 3, 4, and 5.
Card 2 has two matching numbers, so you win one copy each of cards 3 and 4.

Not knowing Elixir properly caused me headaches while solving this.

This is the key piece of code:

```elixir
|> Enum.reduce({0, %{}}, fn {wins, index}, {total, copies} ->
  copies = Map.update(copies, index, 1, fn existing -> existing + 1 end)
  multiply = Map.get(copies, index)

  copies =
    if(wins > 0) do
      (index + 1)..(index + wins)
      |> Enum.reduce(copies, fn index, copies ->
        Map.update(copies, index, multiply, fn existing -> existing + multiply end)
      end)
    else
      copies
    end

  {total + multiply, copies}
end)
```

In this snippet, the reduce is keeping track of the total number of cards and the number of copies as they are won.

For some reason, I thought a loop of `4..4`, where a card has no wins, would not actually loop, but it still loops on a value of 4. 
Once I had figured that out, I had to add the if statement around it.

Quite early on, I had the correct logic, but it took me far too long to fight Elixir syntax and get it to actually produce the correct result.

## Day 3

I had a busy day...

## Day 2

### Part 1

In the second day challenge, we were given a list of games where an elf showed random coloured cubes from a bag.

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

I have noticed I am doing some silly things, like using a reduce instead of a sum, but overall I am really enjoying using Elixir.
The pipe operator feels very similar to using Rust, and having rust experience has been helpful here 🦀; maybe I am using it way too much because of this.

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

I started by splitting the input string into lines and filtering non-empty lines.
The lines could then be split into characters and the characters could then be parsed into integers. Non-numeric characters could be discarded by filtering errors.
I used the `Enum.at` function to get the first and last numbers from the list (with an index of -1 for the last number).
After that, it was a case of concatenating the numbers and adding them all together.

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

Even I can tell this isn't the best Elixir in the world, but I've got 24 days left to sort that out.

### Part 2

The second part was very similar, but each line could also include worded digits, e.g. one, two, three, four, five, six, seven, eight, and nine.

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

I used the same code as part one but I used a simple replace function on every line to replace a worded digit with the corresponding integer.
This almost worked straight away, but I had an issue where some worded digits could share the letters. 
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
