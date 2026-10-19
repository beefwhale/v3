---
title: How to create a simple LLVM Pass while sick and lying in bed
description: How to create a simple LLVM Pass while sick and lying in bed
publishDate: 5 Aug 2026
tags:
- today i learned
- llvm
pinned: false
draft: false
---

Was clearing some OAs after ending my internship at Stripe on the 31 Jul (blog post coming once I stop procrastinating) and there was this challenge under the LFX Mentorship programme im interested in under the RISC-v organization that touched in LLVM Passes. Did I know what was LLVM before this? Nope. Which made this challenge more fun than the other things I've done! So I decided to make a simple post documenting the very quick pass I made.

## My knowledge on compilers

Essentially none. But I did have a pretty senior eng at Stripe (shoutout to evan) that recommended me a book called `Programming Language Pragmatics by Michael L. Scott` which I have been enjoying a whole lot and thought what the heck! why not try!

## Writing a Pass

So writing a pass is honestly pretty simple. The LLVM docs provide a pretty straightforward [guide](https://llvm.org/docs/WritingAnLLVMNewPMPass.html) on how to get started. Didn't run into any issues during setup too it was literally as easy as git cloning and running through their `HelloWorld.cpp` implementation before duplicating it into my own.

The challenge was pretty straightforward. 

> Write an LLVM pass (in C++) that iterates over all functions in a module, **counts memory load/store instructions**, and prints the result. Provide a small C program and a script to run your pass.

Knowing that LLVM just allows u to convert most languages like C/C++/Rust into LLVM Intermediate Representation (IR) that allows compiler optimizations across languages which is also the reason why Rust is able to achieve the same speeds as C.... it is quite intuitive to imagine how this would work.

### Hello World

The Hello World example uses a `.ll` file directly and the pass written just prints the function names using the `Function` object. So I was like "hm...I wonder how i can access the stuff inside the function"

And this was super simple! The LLVM Programmers Manual has a [class definition](https://llvm.org/docs/ProgrammersManual.html#the-function-class) for the `Function` class which mentions the `BasicBlock` class which mentions the `Instruction` class! *Ah! perfect Just what I needed!* Reading the [Instruction class](https://llvm.org/docs/ProgrammersManual.html#the-instruction-class) allowed me to find the function `getOpCode()` which was EXACTLY what I needed to calculate `load` and `store` instructions.

### Writing the Pass

So writing the pass was the easy part after this lol. I just has to run through the objects and check for load and store instructions.

```cpp
#include "llvm/CountMemoryLoadStore.h"
#include "llvm/IR/Function.h"
#include "llvm/IR/Instruction.h"
#include "llvm/IR/BasicBlock.h"

using namespace llvm;

PreservedAnalyses CountMemoryLoadStorePass::run(Function &F, FunctionAnalysisManager &AM) {
    int LoadCount= 0;
    int StoreCount = 0;

    for (BasicBlock &BB : F) {
        for (const Instruction &I : BB) {
            switch(I.getOpcode()){
                case Instruction::Load:
                    LoadCount++;
                    break;
                case Instruction::Store:
                    StoreCount++;
                    break;
                default:
                    break;
            }
        }
    }
    errs() << "Load Count: " << LoadCount << "\n";
    errs() << "Store Count: " << StoreCount << "\n";

    return PreservedAnalyses::all();
}
```
..and print the output.

## Tying it altogther 

After that everything was pretty simple, I created a simple sample c file and figured how to convert `.c` into a `.ll` with clang before I pulled them out the original repo into my own. The overall process was like this

```
dummy.c
   ↓ clang
dummy.ll
   ↓ opt
my LLVM pass
   ↓
counts load/store instructions
   ↓
prints the result
```

I probably could make the pass into a standalone plugin like the guide talks about but im a lil too sick for that. But im super proud of myself to do this without AI writing any code (I even had to turn copilot off cus it was getting annoying), it ended feeling more rewarding and I find myself missing that whole struggle and wait I get it now process a whole lot these days.

Anyways fun chall! Im going to sleep.

::github{repo="beefwhale/llvm_pass"}
