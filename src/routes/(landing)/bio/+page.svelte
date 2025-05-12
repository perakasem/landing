<script lang="ts">
    import { onMount } from 'svelte';
    import { sideImage } from '$lib/stores/sideImageStore';
    import { attributionClass } from '$lib/stores/attributionStore';
    import ScrollProgress from "../../../components/ScrollProgress.svelte";
    import AsteriskBig from "../../../components/AsteriskBig.svelte";
    import AsteriskSmall from "../../../components/AsteriskSmall.svelte";
    import TechStacks from "../../../components/TechStacks.svelte";

    const mobileBreakpoint = 640;
    let isMobile = false;
    let scrolled = false;

    function updateViewport() {
        isMobile = window.innerWidth < mobileBreakpoint;
    }

    function handleScroll(event: Event) {
        const target = event.currentTarget as HTMLElement | null;
        if (!target) return;

        scrolled = target.scrollTop > 60;
    }

    attributionClass.set('attribution-typo-dark');

    onMount(() => {
        sideImage.set('/bio.jpg');
        updateViewport();
        window.addEventListener('resize', updateViewport);
        return () => window.removeEventListener('resize', updateViewport);
    });

    export const load = () => {
        return {
            scrollable: true
        };
    };
</script>

{#if isMobile}
    <ScrollProgress />
    <div class="p-8 flex flex-col h-full overflow-y-auto" on:scroll={handleScroll}>
        <div class="absolute aspect-square w-12 transition-opacity duration-200" class:opacity-0={scrolled}>
            <AsteriskSmall/>
        </div>
        <div class="pt-12 mb-40 mt-20">
            <p class="serif-typo-paragraph text-wrap mb-4">
                <span class="/">I'm Pera</span>, a Computer Science and Mathematics student at the University of Toronto. Originally
                from Bangkok, I'm passionate about leveraging technology to tackle worldly challenges.
                When I'm away from the screen, you will find me exploring the
                arts—<a href="https://perakasem.crd.co" target=_blank
                        rel="noopener noreferrer" class="underline decoration-wavy hover:text-stone-100">photography</a>,
                <a href="/construction" class="underline decoration-wavy hover:text-stone-100">food</a>, music, and
                design—or the wonders of nature.
            </p>
            <p class="serif-typo-paragraph text-wrap mb-4">
                I'm open to internship opportunities
                in the tech and startup space, but also in altruistic endeavors and any cool projects.
                Feel free to <a href="mailto:pkasemsripitak@gmail.com" class="underline decoration-wavy hover:text-stone-100">reach out</a>
                to connect over a <a href="/construction" class="underline decoration-wavy hover:text-stone-100">coffee</a> chat or
                explore potential collaborations—let's create something together!
            </p>
            <hr class="h-px my-12 bg-light">
            <h1 class="sans-typo-title-small mb-1 text-wrap">On Intros</h1>
            <p class="sans-typo-detail text-sm mb-4 text-wrap">Pera Kasemsripitak</p>
            <p class="py-2 serif-typo-body-small text-wrap">
                Life. Introductions often fail to do justice to what truly matters. At this stage of my journey, I've
                learned to treasured what truly moves me.
                For the past five years,
                <a href="https://perakasem.crd.co" target=_blank
                   rel="noopener noreferrer" class="underline decoration-wavy hover:text-stone-100"
                >Photography</a>
                —capturing
                <button class="underline decoration-wavy hover:text-stone-100"
                        on:click|preventDefault={() => {
                           sideImage.set('/bird.jpg');
                           attributionClass.set('attribution-typo-dark');
                       }}
                >
                    nature
                </button>
                ,
                <button
                        class="underline decoration-wavy hover:text-stone-100"
                        on:click|preventDefault={() => {
                           sideImage.set('/california.jpg');
                           attributionClass.set('attribution-typo');
                       }}
                >
                    distant stars
                </button>
                , and
                <button
                        class="underline decoration-wavy hover:text-stone-100"
                        on:click|preventDefault={() => {
                           sideImage.set('/life.jpg');
                           attributionClass.set('attribution-typo');
                       }}
                >
                    life itself
                </button>
                —has occupied my every moment, my camera becoming
                an extension of my eye. My camera has guided me into the deepest of jungles and through society,
                revealing both beauty and harsh realities that have shaped my values. Behind the scenes, music keeps
                me going and feeling alive—shoutout to Thelonious Monk. Yet, what has brought people together the
                most has been my kitchen. What started as a gathering between
                four friends has transformed into increasingly refined dinner parties and supper club sessions. We
                called it
                <a href="/construction" class="underline decoration-wavy hover:text-stone-100">Quatre</a>.
                Now, I'm honing my skills and chasing "type sh*t"—I'll let the project speak for itself.
                I also design things here and there, be it for my other projects or this website itself. It
                would take forever to go on about everything, so to wrap it up, I'm always down to sail, hike, or
                hit the slopes.
            </p>
            <p class="py-2 serif-typo-body-small text-wrap">
                Overview aside, you can take a deeper dive into what I ponder
                at my Bootleg SubStack, dubbed <a href="/pond" class="underline decoration-wavy hover:text-stone-100">3rd Space</a>.
            </p>
            <hr class="h-px my-12 bg-light">
            <h1 class="sans-typo-title-small mb-1 text-wrap">About this Site</h1>
            <p class="sans-typo-detail text-sm mb-4 text-wrap">A meta tangent</p>
            <p class="py-2 serif-typo-body-small text-wrap">
                I designed and developed this website from scratch as an exploration into web design and development. It is always
                evolving, and with many experimental features, I would greatly appreciate any technical and content issue
                reports. Please <a href="mailto:pkasemsripitak@gmail.com" class="underline decoration-wavy hover:text-stone-100">reach out</a>
                to me for any inquiries or suggestions.
            </p>

            <p class="py-2 serif-typo-body-small text-wrap">
                Inspired by Cosmos, Asterisk, Standart, Noma Projects, BougieYelp, CliffStudios
            </p>
            <div class="flex pt-8 gap-x-2">
                <TechStacks/>
            </div>
            <hr class="h-px my-12 bg-light">
            <div class="flex justify-between">
                <a href="/" class="sans-typo-detail hover:underline">Home</a>
                <a href="/now" class="sans-typo-detail hover:underline">Now</a>
            </div>
        </div>
    </div>
{:else}
    <ScrollProgress />
    <div class="p-8 flex flex-col h-full overflow-y-auto" on:scroll={handleScroll}>
        <div class="absolute aspect-square w-16 transition-opacity duration-200" class:opacity-0={scrolled}>
            <AsteriskBig/>
        </div>
        <div class="pt-40 flex flex-col items-center mb-40">
            <div class="max-w-140 flex flex-col">
                <p class="serif-typo text-wrap mb-4">
                    I'm Pera, a Computer Science and Mathematics student at the University of Toronto. Originally
                    from Bangkok, I'm passionate about leveraging technology to tackle worldly challenges.
                    When I'm away from the screen, you will find me exploring the
                    arts—<a href="https://perakasem.crd.co" target=_blank
                            rel="noopener noreferrer" class="underline decoration-wavy hover:text-stone-100">photography</a>,
                    <a href="/construction" class="underline decoration-wavy hover:text-stone-100">food</a>, music, and
                    design—or the wonders of nature.
                </p>
                <p class="serif-typo text-wrap mb-4">
                    I'm open to internship opportunities
                    in the tech and startup space, but also in altruistic endeavors and any cool projects.
                    Feel free to <a href="mailto:pkasemsripitak@gmail.com" class="underline decoration-wavy hover:text-stone-100">reach out</a>
                    to connect over a <a href="/construction" class="underline decoration-wavy hover:text-stone-100">coffee</a> chat or
                    explore potential collaborations—let's create something together!
                </p>
                <hr class="h-px my-12 bg-light">
                <h1 class="sans-typo-title">On Introductions</h1>
                <p class="sans-typo-detail mb-4">Pera Kasemsripitak</p>
                <p class="py-2 serif-typo-paragraph text-wrap">
                    Life. Introductions often fail to do justice to what truly matters. At this stage of my journey, I've
                    learned to treasured what truly moves me.
                    For the past five years,
                    <a href="https://perakasem.crd.co" target=_blank
                       rel="noopener noreferrer" class="underline decoration-wavy hover:text-stone-100"
                    >Photography</a>
                    —capturing
                    <button class="underline decoration-wavy hover:text-stone-100"
                            on:click|preventDefault={() => {
                           sideImage.set('/bird.jpg');
                           attributionClass.set('attribution-typo-dark');
                       }}
                    >
                        nature
                    </button>
                    ,
                    <button
                            class="underline decoration-wavy hover:text-stone-100"
                            on:click|preventDefault={() => {
                           sideImage.set('/california.jpg');
                           attributionClass.set('attribution-typo');
                       }}
                    >
                        distant stars
                    </button>
                    , and
                    <button
                            class="underline decoration-wavy hover:text-stone-100"
                            on:click|preventDefault={() => {
                           sideImage.set('/life.jpg');
                           attributionClass.set('attribution-typo');
                       }}
                    >
                        life itself
                    </button>
                    —has occupied my every moment, my camera becoming
                    an extension of my eye. My camera has guided me into the deepest of jungles and through society,
                    revealing both beauty and harsh realities that have shaped my values. Behind the scenes, music keeps
                    me going and feeling alive—shoutout to Thelonious Monk. Yet, what has brought people together the
                    most has been my kitchen. What started as a gathering between
                    four friends has transformed into increasingly refined dinner parties and supper club sessions. We
                    called it
                    <a href="/construction" class="underline decoration-wavy hover:text-stone-100">Quatre</a>.
                    Now, I'm honing my skills and chasing "type sh*t"—I'll let the project speak for itself.
                    I also design things here and there, be it for my other projects or this website itself. It
                    would take forever to go on about everything, so to wrap it up, I'm always down to sail, hike, or
                    hit the slopes.
                </p>
                <p class="py-2 serif-typo-paragraph text-wrap">
                    Overview aside, you can take a deeper dive into what I ponder
                    at my Bootleg SubStack, dubbed <a href="/pond" class="underline decoration-wavy hover:text-stone-100">3rd Space</a>.
                </p>
                <hr class="h-px my-12 bg-light">
                <h1 class="sans-typo-title">About this Site</h1>
                <p class="sans-typo-detail mb-4">A meta tangent</p>
                <p class="py-2 serif-typo-paragraph text-wrap">
                    I designed and developed this website from scratch as an exploration into web design and development. It is always
                    evolving, and with many experimental features, I would greatly appreciate any technical and content issue
                    reports. Please <a href="mailto:pkasemsripitak@gmail.com" class="underline decoration-wavy hover:text-stone-100">reach out</a>
                    to me for any inquiries or suggestions.
                </p>
                <p class="py-2 serif-typo-paragraph text-wrap">
                    Inspired by Cosmos, Asterisk, Standart, Noma Projects, BougieYelp, CliffStudios.
                </p>
                <div class="flex pt-8 gap-x-2">
                    <TechStacks/>
                </div>
                <hr class="h-px my-12 bg-light">
                <div class="flex justify-between">
                    <a href="/" class="sans-typo-detail hover:underline">Home</a>
                    <a href="/now" class="sans-typo-detail hover:underline">Now</a>
                </div>
            </div>
        </div>
    </div>
{/if}
