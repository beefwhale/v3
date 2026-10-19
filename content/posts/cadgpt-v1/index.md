---
title: CADGPT - idea to parametric models in minutes
description:  How we bring parametric models to busy tinkerers in minutes.
publishDate: 17 May 2025
tags:
- hackathon
pinned: false
draft: false
---

I LOVE keyboards... and you know what being in this hobby gets you into? Obviously an inescapable rabbit hole. Being this deep in this hobby means that at some point you not only want to start modding keyboards, but also created one from scratch...like entirely handwired. Actually the whole process wasn't difficult at all, but one problem I encountered was how the hell I was gonna make the case. I had no skills, and I wanted to make an original design, one that wasn't following the tutorial entirely. That was how this project started.


:::figure
::youtube{id="hdIs0U8Z8W8" title="YouTube video"}

Watch the video above for the full presentation of the project.
:::


## Its crazy how a small project led me on this whole journey..

I'm going to spoil the story early LOL since I eventually did create the macropad with and case made with layers of laser-cut acrylic and avoided the whole skill issue entirely.

![Desktop View](./d966d8aad695.png)

But for a while that problem still bugged my mind. What if I didn't need the skills the to achieve the model I needed? Could Generative AI create my case?

:::tip
[Joe Scotto](https://scottokeebs.com/) is **THE** GOAT when it comes to handwired keyboards and macropads, if you're interested in creating one on your own.
:::

### RhinoGPT

At that point while I was still creating my macropad I was working in Ngee Ann ICT's Generative AI Hub _(Actually working there enabled me to make my own stuff since I had access to makerspace but I digress)_. During some doom scrolling session over the weekend I chanced upon a project made by [Ritual Industries](https://www.instagram.com/ritual.industries/) and felt like I could execute something similarly with a few small videos we showed about his setup. His project back then showed a full functional pipeline using verbal prompting with the latest gpt4o recently released, that created a script in Rhino3D Grasshopper and printed directly with his BambuLab 3D printer. I thought it was like the coolest thing ever.

So inspired by the video and the skill issue I was facing with my macropad, I casually pitched the idea to my then boss _(shoutout to Mr Ben)_ to create the same project for the Hub. Little did I expect, they were extremely supportive of my venture and provided me the resources to execute my plan.
![Desktop View](./e20d23075daa.png)

RhinoGPT was the early stages of how CADGPT came about. It was like the beta version but also completely different to our current CADGPT. You can tell from the architecture itself how much thing were just mashed together it wasn't the best performing project but also not the worst. There was much work left to do.

### Reviving an idea.

After I left my internship in Ngee Ann to start university I truly thought the project was over. Until my friend Edric contacted me on Telegram on a possible project revival. He is currently in Silicon Valley working in a VC and got into contact with Kenneth from Obico, a 3D printing automation company. We got on a call with Kenneth over the weekend and hearing how excited he was in seeing what we could do, Edric and I decided to revive this project...but this time it'll be better, like way better.

### A gap in the market

Back when I was executing RhinoGPT, I had only a couple of days to roll our the project. So this time I did a little bit of research more research to figure out if there were already solutions like that on the wild wild web.

Through extensive googling, I found out that anything remotely usable was leading more towards animation and the game industry where sprites could be generated in seconds to be used in background environments. However, I was looking for something dimension specific and less....organic? That is the main difference with CAD and Organic models. The market for diffusion based model generation was expanding quickly with research coming out creating increasingly more accurate models (eg; [Rodin Diffusion](https://3d-avatar-diffusion.microsoft.com/)) but there wasn't any I could find when it came to CAD Models.

![Desktop View](./e877bdf6a55a.png)

## CADGPT (Computer Aided Design + GPT)

With all of our info researched and PHD research papers read over the course of 2 very slow months, Edric and I started to create CADGPT. Equipped with CAD scripting library CadQuery (CQ), GPT 3o mini tokens and a whole lot of academic neglect, we spent the next 2 months gathering data and combining workflows and eventually settled on this workflow.

![Desktop View](./17f7587b0de2.png)


### Optimizing Ingestion with RAG using Langchain

To be honest we weren't quite sure if this project was going to create sufficient results that we would be proud of since walking into this, we lack existing research and proven results that this was possible. The only thing we kind of had was benchmarks and a pair of stubborn people that wanted to see what would happen if we spent months on something that possibly would never work. But one of the things we wanted to prove was seeing if we could improve generation results created by the LLM when it was equipped with a Retrieval Augmented Generation (RAG) workflow. 


:::figure
![Desktop View](./f43c21157fc1.png)

Source: https://www.ibm.com/think/topics/retrieval-augmented-generation
:::


In simple terms, RAG provides context to LLMs, helping it narrow down its generation to greater accuracy given data on what we're actually doing. RAG is actually often used in chatbots but we wanted to use RAG for code generation. Our idea was to

1. Chunk the documents of CQ _(to chunks that actually makes sense and is not random gibber)_
2. Index the chunks and feed our vector database
3. Get RAG to pull out the chunks based on the given prompt

It was a little difficult to gather the required data to chunk at the start but thanks to the big CQ community, we managed to gather some well documented code that we could test our project with. But those were just the fancy add ons, we mostly focused on chunking the main CQ documentation.

#### Chunking Techniques
One of the main challenges we faced was dealing with the chunking of different datatypes of files since we consume `.pdf/py/md` with `pdf ` files being especially difficult to parse. Since the CQ documentation was not provided in other format, we had to rewrite this parser multiple times. In the beginning we were parsing the files with every k number of lines or using page breaks to chunk the data but we felt the embeddings called to be unhelpful to our queries. **Thus eventually we decided to tie text contexts to our code segments to be able to provide enough context to our chunks.** You can view our chunks in the gallery.


### Optimizing Generation with Agentic AI Workflows


:::figure
![Desktop View](./6cef89886852.png)

Source:https://github.com/The-Pocket-World/Pocket-Flow-Framework
:::


But RAG wasn't the only technique we deployed. That was used to optimize **ingestion**. We needed something that would optimize our **generation** process. That was where [Pocketflow](https://pocketflow.dev/) came in and it became our gamechanger. Edric mainly handled this section, writing a short workflow with the Pocketflow framework that ensured the AI went through multiple thought processes before producing the generation results, increasing the accuracy of our generation to a significant degree.

### Comparing results to latest models

Finally after our entire workflow was in place, we tested and crafted a detailed prompt that would create exactly the results we wanted and tested the same prompts in current AI search engines running the latest models like GPT4o and Claude 3.7 and found CADGPT to be **surpassing** them both in accuracy. Watch the video above for a comparison and also to see the actual miniature print of the model!

## To sum it all up..

We have summarised our entire project in a single poster describing on a high level our design and tools used in our main processes to achieve the results we want. 

![Desktop View](./4e8533aa0068.png)


If you have read this blog until the end, thank you! Going through this project was a scary one. Spending significant time on something I wasn't sure would work instead of using it to catch up on my tutorials was gamble, but it was a worthwhile journey in the end seeing a proper model created by CADGPT a hundred times *(might be exaggerating a little here)* more accurate than RhinoGPT's.

Although CADGPT isn't refined to the state where it can create my macropad case yet, Edric and I have plans to work further on the project -- increasing its accuracy and prompt complexity while reducing our prompt length.

Until then, let us know what you think. toodles~!


::github{repo="beefwhale/cadgpt"}

## Special Thanks

- My awesome teammate: [Edric](https://www.linkedin.com/in/edric-khiew)
- Mr Ben Low _(thanks for helping me print a model sample!)_, Mr Chang Bin Haw
- Makerspace
- Kenneth (Obico)

## References & Tools

- **Frameworks and Libraries:**
[CadQuery](https://github.com/CadQuery/cadquery)
[Langchain](https://www.langchain.com/)
- **LLM & Embeddings:**: OpenAI’s GPT o3-mini
- **Agentic Workflow:** [Pocketflow](https://pocketflow.dev/)
- **Data and Code Sources:**
[pixegami](https://github.com/pixegami/rag-tutorial-v2)
[cq_warehouse](https://github.com/gumyr/cq_warehouse)
[cadquery-contrib](https://github.com/CadQuery/cadquery-contrib/tree/master)
[Edi Liberato](https://eddieliberato.github.io/blog/2022-06-26-cadquery-models-collection/)
- **Research Papers (Benchmarks):**
[CodeRAG-Bench](https://code-rag-bench.github.io/)
[EVOR](https://arks-codegen.github.io/)


## Gallery

![Gallery image 1](./6ca1d29db81f.jpg)

![Gallery image 2](./00a209e00c3c.jpg)

![Gallery image 3](./5d13b4d1a29d.jpg)

![Gallery image 4](./054777d883dc.jpg)

![Gallery image 5](./5f3586671362.jpg)
