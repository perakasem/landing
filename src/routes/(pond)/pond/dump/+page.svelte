<script lang="ts">
    import { afterNavigate } from "$app/navigation";
    import { onMount, onDestroy, beforeUpdate } from "svelte";
    import { browser } from "$app/environment";
    import type { PageData, GalleryImageWithIndex } from "$lib/types";
    import { fade, scale } from "svelte/transition";
    import { quintOut } from "svelte/easing";
    import { writable } from 'svelte/store';

    // Create a store to persist mobile state across navigation
    const isMobileStore = writable(false);

    // Explicitly type the data prop
    export let data: PageData;

    const mobileBreakpoint = 1000;
    let isMobile = false;
    let element: HTMLElement | null = null;
    let layoutInitialized = false;

    // Lightbox state
    let showLightbox = false;
    let currentImageIndex = 0;

    // Images array from server-loaded data
    let images = data.images;

    // Define image type with index property
    // type GalleryImageWithIndex = {
    //     src: string;
    //     alt: string;
    //     index: number;
    // };

    // Split images into columns for masonry layout
    function getColumnImages(columnCount: number) {
        const columns: GalleryImageWithIndex[][] = Array.from({ length: columnCount }, () => []);

        // Distribute images among columns
        images.forEach((image, index) => {
            columns[index % columnCount].push({
                src: image.src,
                alt: image.alt,
                index // Store original index for lightbox navigation
            });
        });

        return columns;
    }

    // Subscribe to the mobile store
    isMobileStore.subscribe(value => {
        isMobile = value;
    });

    // Reactive variables for columns
    $: columnCount = isMobile ? 2 : 3;
    $: columns = getColumnImages(columnCount);

    function updateViewport() {
        if (browser) {
            const newIsMobile = window.innerWidth < mobileBreakpoint;
            isMobile = newIsMobile;
            isMobileStore.set(newIsMobile);
        }
    }

    function openLightbox(index: number) {
        currentImageIndex = index;
        showLightbox = true;
        // Prevent scrolling when lightbox is open
        if (browser) {
            document.body.style.overflow = 'hidden';
        }
    }

    function closeLightbox() {
        showLightbox = false;
        if (browser) {
            document.body.style.overflow = '';
        }
    }

    function nextImage() {
        currentImageIndex = (currentImageIndex + 1) % images.length;
    }

    function prevImage() {
        currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
    }

    // Handle keyboard navigation
    function handleKeydown(event: KeyboardEvent) {
        if (!showLightbox) return;

        switch (event.key) {
            case 'ArrowRight':
                nextImage();
                break;
            case 'ArrowLeft':
                prevImage();
                break;
            case 'Escape':
                closeLightbox();
                break;
        }
    }

    // Check for mobile state during component initialization
    beforeUpdate(() => {
        if (browser && !layoutInitialized) {
            updateViewport();
        }
    });

    afterNavigate(() => {
        if (element) {
            element.scrollIntoView();
        }
    });

    onMount(() => {
        updateViewport();
        layoutInitialized = true;

        // Add event listeners
        window.addEventListener('resize', updateViewport);
        window.addEventListener('keydown', handleKeydown);

        // Cleanup
        return () => {
            window.removeEventListener('resize', updateViewport);
            window.removeEventListener('keydown', handleKeydown);
        };
    });

    onDestroy(() => {
        // Make sure to restore normal scrolling if component is destroyed with lightbox open
        if (browser && showLightbox) {
            document.body.style.overflow = '';
        }
    });
</script>

<div bind:this={element} class="flex flex-col h-full">
    <div class="my-32 {isMobile ? 'mx-8' : 'mx-32'} flex flex-col">
        <div class="flex flex-row mb-8">
            <a href="/pond" class="serif-typo-{isMobile ? 'title' : 'page-title'} {!isMobile && 'text-xl'} hover:animate-pulse">Dump</a>
        </div>

        {#if images.length > 0}
            <!-- Masonry layout using flexbox columns -->
            <div class="flex gap-{isMobile ? '2' : '4'}">
                {#each columns as column, colIndex}
                    <div class="flex-1 flex flex-col gap-{isMobile ? '2' : '4'}">
                        {#each column as image}
                            <div class="w-full">
                                <button
                                        class="block w-full text-left focus:outline-none rounded-md"
                                        on:click={() => openLightbox(image.index)}
                                        aria-label={`View ${image.alt}`}
                                >
                                    <img
                                            src={image.src}
                                            alt={image.alt}
                                            class="w-full h-auto"
                                    >
                                </button>
                            </div>
                        {/each}
                    </div>
                {/each}
            </div>
        {:else}
            <p class="mono-typo-nav">No images found in the gallery folder.</p>
        {/if}

        {#if isMobile}
            <div class="flex justify-between mt-8">
                <a href="/pond" class="mono-typo-nav border rounded-2xl px-3 py-1 text-center">&lt; Current Chapter</a>
            </div>
        {:else}
            <div class="flex justify-between mt-8">
                <a href="/pond" class="mono-typo-nav hover:underline">&lt Current Chapter</a>
            </div>
        {/if}
    </div>
</div>

<!-- Lightbox overlay -->
{#if showLightbox}
    <!-- Translucent overlay background -->
    <div
            class="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center px-4"
            transition:fade={{ duration: 250 }}
            role="dialog"
            aria-modal="true"
            aria-label="Image lightbox"
    >
        <!-- Invisible button that covers the entire screen for closing -->
        <button
                class="absolute z-10 inset-0 w-full h-full cursor-default focus:outline-none"
                on:click={closeLightbox}
                aria-label="Close lightbox"
        ></button>

        <!-- Container for image and navigation - different layout for mobile -->
        {#if isMobile}
            <!-- Mobile layout: image on top, controls below -->
            <div class="relative flex flex-col items-center justify-center z-20">
                <!-- Image container -->
                <div class="relative mb-4" on:click|stopPropagation={() => {}}>
                    <img
                            src={images[currentImageIndex].src}
                            alt={images[currentImageIndex].alt}
                            class="max-w-full max-h-[75vh] object-contain focus:outline-none"
                            on:click|stopPropagation={() => {}}
                    />
                </div>

                <!-- Navigation controls below image on mobile -->
                <div class="flex justify-center items-center gap-8 z-30">
                    <button
                            class="text-white p-2 hover:text-gray-300 focus:outline-none"
                            on:click|stopPropagation={prevImage}
                            aria-label="Previous image"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-8 h-8">
                            <path stroke-width="1.5" d="M15 19l-7-7 7-7"></path>
                        </svg>
                    </button>
                    <button
                            class="text-white p-2 hover:text-gray-300 focus:outline-none"
                            on:click|stopPropagation={nextImage}
                            aria-label="Next image"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-8 h-8">
                            <path stroke-width="1.5" d="M9 5l7 7-7 7"></path>
                        </svg>
                    </button>
                </div>
            </div>
        {:else}
            <!-- Desktop layout: controls on sides of image -->
            <div
                    class="relative max-w-5xl w-full max-h-[90vh] flex items-center justify-center"
                    transition:scale={{ duration: 300, easing: quintOut, start: 0.9 }}
            >
                <!-- Previous button -->
                <button
                        class="absolute left-2 top-1/2 transform -translate-y-1/2 text-white p-3 hover:text-gray-300 focus:outline-none"
                        on:click|stopPropagation={prevImage}
                        aria-label="Previous image"
                        style="z-index: 51;"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-8 h-8 md:w-15 md:h-15">
                        <path stroke-width="1.5" d="M15 19l-7-7 7-7"></path>
                    </svg>
                </button>

                <!-- Image container -->
                <div class="relative flex justify-center" on:click|stopPropagation={() => {}}>
                    <img
                            src={images[currentImageIndex].src}
                            alt={images[currentImageIndex].alt}
                            class="max-w-4/5 max-h-[85vh] z-20 object-contain focus:outline-none"
                            on:click|stopPropagation={() => {}}
                    />
                </div>

                <!-- Next button -->
                <button
                        class="absolute right-2 top-1/2 transform -translate-y-1/2 text-white p-3 hover:text-gray-300 focus:outline-none"
                        on:click|stopPropagation={nextImage}
                        aria-label="Next image"
                        style="z-index: 51;"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-8 h-8 md:w-15 md:h-15">
                        <path stroke-width="1.5" d="M9 5l7 7-7 7"></path>
                    </svg>
                </button>
            </div>
        {/if}
    </div>
{/if}