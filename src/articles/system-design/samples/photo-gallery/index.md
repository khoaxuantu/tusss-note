---
title: A small photo gallery service for GDG Hanoi
date: 2026-04-18
id: samples/photo-gallery
description: I had a chance to build a photo gallery service for GDG Hanoi's events. This article is a reflection of my design process.
language: en
next_article:
  path: /system-design/samples/photo-gallery/requirements
  title: Requirement specifications
---

# GDG Hanoi photo gallery

## Introduction

For someone who might not know, I'm also an event organizer of Google Developer Group Hanoi. Last
month, I contributed to holding an event called Build with AI Hanoi 2026.

On the preparation for event days, we encountered a challenge: as the media team is going to take
quite a lot of photos during the event, and as the feedback from previous attendees is that they want
their photos to be delivered as soon as possible, the technical team decided to kick off a photo
gallery site that satisfies both requirements from the media team and the attendees.

I was assigned to be a core member of this project.

I launched the service in around a week, and it is fair to say that I had found many interesting
things around the system. In this post, let me share the notes that I had taken throughout my
design process for this service.

Btw, you can visit our album here to have a quick look on my final result:\
[Build with AI Hanoi 2026 - Gallery](https://event.gdghanoi.com/galleries/2026/bwai)

## Table of contents

As the service is a real project that has been launched successfully and I have many things to share,
I will split this article into smaller posts below:

- [Requirement specifications](/system-design/samples/photo-gallery/requirements)
- [High-level design components](/system-design/samples/photo-gallery/high-level-designs)
- [Data model & API designs](/system-design/samples/photo-gallery/api-designs)
- [Photo processing designs](/system-design/samples/photo-gallery/photo-processing)
