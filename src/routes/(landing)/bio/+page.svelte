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
                I am an undergraduate student in Computer Science and Mathematics in Economics and Finance at the
                University of Toronto— is what you just read above, and frankly, like the start of most introductions
                you will hear. As I think of a better opener, I'd like to let you in on a few thoughts
                behind these credentials. While I titled this section 'On Introductions', this is where the real
                bio begins.
            </p>
            <p class="py-2 serif-typo-body-small text-wrap">
                The degree. I always ask why people do what they do—their vision often reveals
                deeper truths about their path. My own journey started from being a 'stem guy' my whole school life,
                and from there, it was only natural to follow this path.
                I saw computer science as a powerful tool that could optimize and advance processes
                in fields from agriculture to aerospace engineering, and provide analytics for combating pressing climate
                issues. But as I began my studies, my world quickly became engulfed in mathematical proofs—an enlightening
                and challenging endeavor. While I still believe in implementing technology for positive change, the landscape is shifting dramatically.
                The rapid march towards artificial general intelligence has cast a shadow of uncertainty
                over the field, stirring warranted concerns about its trajectory—and ultimately, mine.
                Moreover, peering into the driving force of the industry revealed a disconnect: many of today's optimization goals
                feel far removed from the charm and power of problem solving that initially drew me in.
                Yet I am here to adapt, unbound by the title of a computer scientist. With the constant goal of
                innovating meaningful solutions in mind, my field of study and approach will evolve alongside these
                technological leaps.
            </p>
            <p class="py-2 serif-typo-body-small text-wrap">
                Life. Introductions often fail to do justice to what truly matters, reducing true meaning to mere
                hobbies enumerated in passing. At this stage of my journey, I've learned to treasured what truly moves me.
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
                an extension of my eye. My camera has guided me into the deepest of jungles and through the echelons
                of society, revealing both beauty and harsh realities that have shaped my values. Behind the scenes, music keeps me going and
                feeling alive—shoutout to Thelonious Monk and Doechii. While I wish I could play as much as I consume,
                my own drumming has become a cherished but rare indulgence. Yet, what has brought people together the
                most has been my kitchen. What started as a gathering between
                four friends has transformed into increasingly refined dinner parties and supper clubs. We called it
                <a href="/construction" class="underline decoration-wavy hover:text-stone-100">Quatre</a>.
                Now, I'm refining my culinary skills and chasing "type sh*t"—I'll let the project speak for itself.
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
                    I am an undergraduate student in Computer Science and Mathematics in Economics and Finance at the
                    University of Toronto— is what you just read above, and frankly, like the start of most introductions
                    you will hear. As I think of a better opener, I'd like to let you in on a few thoughts
                    behind these credentials. While I titled this section 'On Introductions', this is where the real
                    bio begins.
                </p>
                <p class="py-2 serif-typo-paragraph text-wrap">
                    The degree. I always ask why people do what they do—their vision often reveals
                    deeper truths about their path. My own journey started from being a 'stem guy' my whole school life,
                    and from there, it was only natural to follow this path.
                    I saw computer science as a powerful tool that could optimize and advance processes
                    in fields from agriculture to aerospace engineering, and provide analytics for combating pressing climate
                    issues. But as I began my studies, my world quickly became engulfed in mathematical proofs—an enlightening
                    and challenging endeavor. While I still believe in implementing technology for positive change, the landscape is shifting dramatically.
                    The rapid march towards artificial general intelligence has cast a shadow of uncertainty
                    over the field, stirring warranted concerns about its trajectory—and ultimately, mine.
                    Moreover, peering into the driving force of the industry revealed a disconnect: many of today's optimization goals
                    feel far removed from the charm and power of problem solving that initially drew me in.
                    Yet I am here to adapt, unbound by the title of a computer scientist. With the constant goal of
                    innovating meaningful solutions in mind, my field of study and approach will evolve alongside these
                    technological leaps.
                </p>
                <p class="py-2 serif-typo-paragraph text-wrap">
                    Life. Introductions often fail to do justice to what truly matters, reducing true meaning to mere
                    hobbies enumerated in passing. At this stage of my journey, I've learned to treasured what truly moves me.
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
                    an extension of my eye. My camera has guided me into the deepest of jungles and through the echelons
                    of society, revealing both beauty and harsh realities that have shaped my values. Behind the scenes, music keeps me going and
                    feeling alive—shoutout to Thelonious Monk and Doechii. While I wish I could play as much as I consume,
                    my own drumming has become a cherished but rare indulgence. Yet, what has brought people together the
                    most has been my kitchen. What started as a gathering between
                    four friends has transformed into increasingly refined dinner parties and supper clubs. We called it
                    <a href="/construction" class="underline decoration-wavy hover:text-stone-100">Quatre</a>.
                    Now, I'm refining my culinary skills and chasing "type sh*t"—I'll let the project speak for itself.
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
