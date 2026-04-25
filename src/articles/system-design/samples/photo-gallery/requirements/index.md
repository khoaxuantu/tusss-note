---
title: GDG Hanoi photo gallery | Requirement specifications
date: 2026-04-18
id: requirement-specifications
language: en
prev_article:
  path: /system-design/samples/photo-gallery
  title: Introduction
next_article:
  path: /system-design/samples/photo-gallery/high-level-designs
  title: High-level design components
stylesheets:
  - /styles/articles/block.css
---

##### _GDG Hanoi photo gallery_

# Requirement specifications

<div class="note">

This post is a part of a series of posts about my design process for a photo gallery service for
GDG Hanoi. You can find the introduction post here: [Introduction](/system-design/samples/photo-gallery).

</div>

Starting at clarifying the requirements, I typically label them to functional and non-functional
requirements.

## Functional requirements

- **Uploading photos in batches:** The media team may want to upload a batch of photos to the
  storage.
- **Rendering a gallery page in two modes:**
  - Scrolling view: Users can scroll through a list of photos of a gallery. It requires the photo
    collection to support cursor-based pagination.
  - Paging view: Users can switch between pages of a gallery to view photos. It requires the photo
    collection to support offset-based pagination.
- **Multiple photo albums:** There will be multiple gallery pages, which corresponds to each event
  of GDG Hanoi. So I ought to design a mechanism to manage and retrieve photos for a specific event.
- **Photo processing:** As uploaded photos are original high quality files, the service should
  provide a worker to transform the photo into various versions that can be served to clients in low
  latency and ensure the visually quality.
- **Responsive image serving:** Provide various sizes of a same photo to different clients
  based on their screen sizes to optimize the bandwidth usage.
- **Downloading photos:** The attendees may want to download high-quality photos, so the service
  should support saving the original files and provide download links to the clients.

## Non-functional requirements

- **Performance:**
  - As there will be gallery pages, each page visit may result in dozens to hundreds
    of requests to fetch photos. To maintain a smooth user experience, I should aim to serve the
    photos with a millisecond unit of latency.
  - The media each time uploading may upload up to hundreds of high quality photos (may be 1MB -
    20MB per each). So I should aim to provide a service that can handle the upload of these
    photos in a reasonalbe amount of time, as well as a reasonable UX mechanism to confront them.

<div class="note">

In case nobody know, on a live event day, there will be a tons of work that have to do continously
for the organizers, so it will be great if the uploading time can be short enough to avoid annoying
feelings.

</div>

- **Availability:**
  - The photo serving service should be available all the time to serve the photos
    to clients at any time. The availability percentage depends on the cloud provider I choose to
    host.
  - For the upload service, it only needs to be available for media members on the live event days.

- **Reliability:** For the upload service, it should have an auto-recovery mechanism so that I don't have to turn
  it on manually (in case of the hosting server is crashed or rebooted) while being busy on guiding
  attendees in the live event.

- **Scalability:**
  - Because the service is required to serve the photos for GDG Hanoi events later on
    and partition the photos by events, I should design the storage to be able to register new albums
    for each event easily.
  - In facts, on the peak traffic time, also known as the live event days, the traffic is not so large,
    only up to 30k page visits on a single day. So we can neglect the server scalability of the system.
