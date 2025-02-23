<script lang="ts">
    import { onMount } from 'svelte';
    import { sideImage } from '$lib/stores/sideImageStore';
    import { attributionClass } from '$lib/stores/attributionStore';
    import ScrollProgress from "../../../components/ScrollProgress.svelte";
    import AsteriskBig from "../../../components/AsteriskBig.svelte";
    import AsteriskSmall from "../../../components/AsteriskSmall.svelte";

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
                Overview aside, you can take a deeper dive into what I ponder (and read more of these)
                at my Bootleg SubStack, aptly dubbed <a href="/pond" class="underline decoration-wavy hover:text-stone-100">the pond</a>.
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
            <div class="flex pt-8">
                <svg class="mr-2" width="30" height="30" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g id="sveltejs" clip-path="url(#clip0_790_10613)">
                        <path id="Vector" d="M86.0001 13.1999C76.7001 -0.100074 58.3001 -4.00007 45.0001 4.49993L21.7001 19.2999C20.1001 20.2999 18.7001 21.3999 17.3001 22.6999C16.0001 23.9999 14.8001 25.3999 13.7001 26.8999C12.6001 28.3999 11.8001 30.0999 11.1001 31.7999C10.4001 33.4999 9.90012 35.2999 9.60012 37.0999C9.30012 38.5999 9.20012 40.1999 9.20012 41.6999C9.20012 43.2999 9.30012 44.7999 9.50012 46.2999C9.70012 47.7999 10.1001 49.2999 10.6001 50.7999C11.1001 52.2999 11.7001 53.6999 12.4001 55.0999C11.9001 55.8999 11.4001 56.5999 11.0001 57.3999C10.6001 58.1999 10.2001 58.9999 9.90012 59.8999C9.60012 60.6999 9.30012 61.5999 9.00012 62.4999C8.80012 63.3999 8.50012 64.1999 8.40012 65.0999C7.80012 68.9999 7.90012 72.7999 8.70012 76.4999C9.10012 78.2999 9.70012 80.0999 10.5001 81.8999C11.3001 83.5999 12.2001 85.2999 13.3001 86.7999C22.6001 100.1 40.9001 104 54.2001 95.5999L77.5001 80.7999C79.1001 79.7999 80.5001 78.6999 81.9001 77.3999C83.2001 76.0999 84.4001 74.6999 85.5001 73.1999C86.5001 71.6999 87.4001 69.9999 88.1001 68.2999C88.8001 66.5999 89.3001 64.7999 89.7001 62.9999C90.0001 61.4999 90.1001 59.8999 90.1001 58.3999C90.1001 56.7999 90.0001 55.2999 89.8001 53.7999C89.6001 52.2999 89.2001 50.7999 88.7001 49.2999C88.2001 47.7999 87.6001 46.3999 86.9001 44.9999C87.4001 44.1999 87.9001 43.4999 88.3001 42.6999C88.7001 41.8999 89.1001 41.0999 89.4001 40.1999C89.7001 39.3999 90.0001 38.4999 90.3001 37.5999C90.5001 36.6999 90.8001 35.8999 90.9001 34.9999C91.2001 33.0999 91.4001 31.1999 91.3001 29.3999C91.3001 27.4999 91.0001 25.5999 90.6001 23.7999C90.2001 21.9999 89.6001 20.1999 88.8001 18.3999C88.0001 16.4999 87.1001 14.7999 86.0001 13.1999Z" fill="#717171"/>
                        <path id="Vector_2" d="M42.7999 88.1001C40.9999 88.6001 39.1 88.8001 37.2 88.7001C35.3 88.6001 33.5 88.2001 31.7 87.6001C29.9 86.9001 28.2999 86.0001 26.7999 84.9001C25.2999 83.7001 24 82.4001 22.9 80.8001C22.2 79.9001 21.7 78.9001 21.2 77.8001C20.7 76.8001 20.4 75.7001 20.1 74.6001C19.9 73.5001 19.7 72.4001 19.7 71.2001C19.7 70.1001 19.8 68.9001 20 67.8001C20 67.6001 20.1 67.4001 20.1 67.3001C20.1 67.1001 20.2 66.9001 20.2 66.8001C20.2 66.6001 20.2999 66.4001 20.2999 66.3001C20.3999 66.1001 20.4 65.9001 20.5 65.8001L20.9 64.5001L22.1 65.4001C22.8 65.9001 23.5 66.4001 24.2 66.8001C24.9 67.2001 25.7 67.7001 26.4 68.0001C27.2 68.4001 27.9 68.7001 28.7 69.0001C29.5 69.3001 30.3 69.6001 31.1 69.8001L32 70.1001L31.9 71.0001C31.9 71.6001 31.8999 72.2001 32.0999 72.8001C32.1999 73.1001 32.3 73.4001 32.4 73.7001C32.5 74.0001 32.7 74.2001 32.9 74.5001C33.2 75.0001 33.5999 75.4001 34.0999 75.7001C34.4999 76.0001 34.9999 76.3001 35.5999 76.5001C36.1999 76.7001 36.6999 76.8001 37.2999 76.8001C37.8999 76.8001 38.4 76.8001 39 76.6001C39.1 76.6001 39.3 76.5001 39.4 76.5001C39.5 76.5001 39.5999 76.4001 39.7999 76.4001C39.8999 76.3001 40 76.3001 40.2 76.2001C40.3 76.1001 40.4 76.1001 40.5 76.0001L63.7 61.0001C64 60.8001 64.3 60.6001 64.5 60.4001C64.7 60.2001 64.9999 59.9001 65.0999 59.6001C65.2999 59.3001 65.3999 59.0001 65.5999 58.7001C65.6999 58.4001 65.8 58.1001 65.9 57.7001C66 57.4001 66 57.0001 66 56.7001C66 56.4001 65.9 56.0001 65.9 55.7001C65.8 55.4001 65.6999 55.0001 65.5999 54.7001C65.4999 54.4001 65.2999 54.1001 65.0999 53.8001C64.7999 53.3001 64.4 52.9001 63.9 52.6001C63.5 52.3001 63 52.0001 62.4 51.8001C61.9 51.6001 61.3 51.5001 60.7 51.5001C60.1 51.5001 59.6 51.5001 59 51.7001C58.9 51.7001 58.6999 51.8001 58.5999 51.8001C58.4999 51.8001 58.4 51.9001 58.2 51.9001C58.1 52.0001 57.9999 52.0001 57.7999 52.1001C57.6999 52.2001 57.6 52.2001 57.5 52.3001L48.5999 58.0001C48.1999 58.2001 47.9 58.4001 47.5 58.7001C47.1 58.9001 46.6999 59.1001 46.2999 59.3001C45.8999 59.5001 45.4999 59.6001 45.0999 59.8001C44.6999 59.9001 44.3 60.1001 43.9 60.2001C42.1 60.7001 40.1999 60.9001 38.2999 60.8001C36.3999 60.7001 34.5999 60.3001 32.7999 59.7001C30.9999 59.0001 29.4 58.1001 27.9 57.0001C26.4 55.8001 25.1 54.5001 24 52.9001C23.3 52.0001 22.7999 51.0001 22.2999 49.9001C21.7999 48.9001 21.5 47.8001 21.2 46.7001C21 45.6001 20.7999 44.5001 20.7999 43.3001C20.7999 42.2001 20.9 41.0001 21.1 39.9001C21.5 37.7001 22.3 35.6001 23.6 33.7001C24.9 31.8001 26.5 30.3001 28.4 29.1001L51.7 14.3001C52.1 14.1001 52.3999 13.9001 52.7999 13.6001C53.1999 13.4001 53.6 13.2001 54 13.0001C54.4 12.8001 54.8 12.7001 55.2 12.5001C55.6 12.4001 56 12.2001 56.4 12.1001C58.2 11.6001 60.1 11.4001 62 11.5001C63.9 11.6001 65.7 12.0001 67.5 12.6001C69.3 13.3001 70.9 14.2001 72.4 15.3001C73.9 16.5001 75.2 17.8001 76.3 19.4001C77 20.3001 77.5 21.3001 78 22.4001C78.5 23.4001 78.7999 24.5001 79.0999 25.6001C79.3999 26.7001 79.5 27.8001 79.5 29.0001C79.5 30.1001 79.3999 31.3001 79.1999 32.4001C79.1999 32.6001 79.0999 32.8001 79.0999 32.9001C79.0999 33.1001 79 33.3001 79 33.4001C79 33.6001 78.9 33.8001 78.9 33.9001C78.8 34.1001 78.7999 34.3001 78.6999 34.4001L78.3 35.7001L77.0999 34.8001C76.3999 34.3001 75.7 33.8001 75 33.4001C74.3 33.0001 73.5 32.5001 72.8 32.2001C71.3 31.4001 69.6999 30.8001 68.0999 30.3001L67.1999 30.0001L67.3 29.1001C67.3 28.8001 67.3 28.5001 67.3 28.2001C67.3 27.9001 67.1999 27.6001 67.0999 27.3001C66.9999 27.0001 66.9 26.7001 66.8 26.4001C66.7 26.1001 66.5 25.9001 66.3 25.6001C66 25.1001 65.5999 24.7001 65.0999 24.4001C64.6999 24.1001 64.1999 23.8001 63.5999 23.6001C62.4999 23.2001 61.3999 23.2001 60.2999 23.5001C60.1999 23.5001 60 23.6001 59.9 23.6001C59.8 23.6001 59.7 23.7001 59.5 23.7001C59.4 23.8001 59.2999 23.8001 59.0999 23.9001C58.9999 24.0001 58.8999 24.0001 58.7999 24.1001L35.5 39.0001C35.2 39.2001 35 39.4001 34.7 39.6001C34.5 39.8001 34.1999 40.1001 34.0999 40.4001C33.8999 40.7001 33.7999 41.0001 33.5999 41.3001C33.4999 41.6001 33.3999 41.9001 33.2999 42.3001C33.1999 42.6001 33.2 43.0001 33.2 43.3001C33.2 44.0001 33.4 44.7001 33.7 45.3001C33.8 45.6001 34 45.9001 34.2 46.2001C34.5 46.7001 34.9 47.1001 35.4 47.4001C35.8 47.7001 36.3 48.0001 36.9 48.2001C38 48.6001 39.1 48.7001 40.2 48.4001C40.3 48.4001 40.4999 48.3001 40.5999 48.3001C40.6999 48.3001 40.8 48.2001 41 48.2001C41.1 48.1001 41.2 48.1001 41.4 48.0001C41.5 47.9001 41.6 47.9001 41.7 47.8001L50.5999 42.1001C50.9999 41.9001 51.3 41.6001 51.7 41.4001C52.1 41.2001 52.5 41.0001 52.9 40.8001C53.3 40.6001 53.6999 40.5001 54.0999 40.3001C54.4999 40.2001 54.8999 40.0001 55.2999 39.9001C57.0999 39.4001 59 39.2001 60.9 39.3001C62.8 39.4001 64.6 39.8001 66.4 40.4001C68.2 41.1001 69.8 42.0001 71.3 43.1001C72.8 44.3001 74.0999 45.6001 75.1999 47.2001C75.8999 48.1001 76.4 49.1001 76.9 50.2001C77.4 51.2001 77.7 52.3001 78 53.4001C78.3 54.5001 78.4 55.6001 78.4 56.8001C78.4 57.9001 78.2999 59.1001 78.0999 60.2001C77.8999 61.3001 77.5999 62.4001 77.1999 63.4001C76.7999 64.4001 76.2999 65.4001 75.5999 66.3001C74.9999 67.2001 74.3 68.1001 73.5 68.9001C72.7 69.7001 71.8 70.4001 70.9 71.0001L47.5 86.0001C47.1 86.2001 46.8 86.5001 46.4 86.7001C46 86.9001 45.6 87.1001 45.2 87.3001C44.8 87.5001 44.4 87.6001 44 87.8001C43.6 87.8001 43.1999 87.9001 42.7999 88.1001Z" fill="white"/>
                    </g>
                    <defs>
                        <clipPath id="clip0_790_10613">
                            <rect width="100" height="100" fill="white"/>
                        </clipPath>
                    </defs>
                </svg>
                <svg class="mx-2" width="30" height="30" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g id="astro">
                        <g id="astro_2">
                            <path id="Vector" d="M35.6962 85.1738C31.1941 81.0441 29.8798 72.3671 31.7555 66.0811C35.0079 70.0444 39.5143 71.2997 44.1821 72.0084C51.3881 73.1021 58.4652 72.6931 65.1592 69.3881C65.9248 69.0097 66.6325 68.5067 67.4692 67.9971C68.0975 69.8254 68.2608 71.6717 68.0415 73.5504C67.5082 78.1264 65.2388 81.6611 61.6292 84.3404C60.1858 85.4121 58.6585 86.3701 57.1678 87.3808C52.5885 90.4868 51.3495 94.1285 53.0701 99.4261C53.1111 99.5551 53.1478 99.6841 53.2401 99.9991C50.9018 98.9491 49.1941 97.4205 47.8928 95.4101C46.5181 93.2885 45.8641 90.9415 45.8298 88.4021C45.8125 87.1664 45.8125 85.9194 45.6468 84.7014C45.2425 81.7311 43.8531 80.4011 41.2351 80.3244C38.5485 80.2458 36.4232 81.9124 35.8597 84.5371C35.8167 84.7384 35.7543 84.9374 35.6919 85.1714L35.6962 85.1738Z" fill="#717171"/>
                            <path id="Vector_2" d="M10 65.0336C10 65.0336 23.3316 58.5166 36.7005 58.5166L46.7801 27.2146C47.1574 25.7008 48.2594 24.672 49.5031 24.672C50.7471 24.672 51.8491 25.7008 52.2264 27.2146L62.3061 58.5166C78.1395 58.5166 89.0065 65.0336 89.0065 65.0336C89.0065 65.0336 66.3618 3.13218 66.3175 3.00798C65.6675 1.17784 64.5705 -0.000854492 63.0911 -0.000854492H35.9178C34.4385 -0.000854492 33.3856 1.17784 32.6914 3.00798C32.6425 3.12983 10 65.0336 10 65.0336Z" fill="white"/>
                        </g>
                    </g>
                </svg>
                <svg class="mx-2" width="30" height="30" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g id="html5">
                        <path id="Vector" d="M14 90L6 0H94.2L86.2 90L50 100" fill="#767676"/>
                        <path id="Vector_2" d="M50.1 92.2998V7.2998H86.1L79.2 84.0998" fill="#888888"/>
                        <path id="Vector_3" d="M22.4 18.3999H50.1V29.3999H34.5L35.5 40.6999H50.1V51.6999H25.4L22.4 18.3999ZM25.9 57.2999H37L37.8 66.0999L50.1 69.3999V80.8999L27.4 74.5999" fill="#EBEBEB"/>
                        <path id="Vector_4" d="M77.7 18.3999H50V29.3999H76.6L77.7 18.3999ZM75.7 40.6999H50V51.6999H63.6L62.3 65.9999L50 69.3999V80.8999L72.6 74.5999" fill="white"/>
                    </g>
                </svg>
                <svg class="mx-2" width="30" height="30" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g id="typescript" clip-path="url(#clip0_790_10643)">
                        <path id="Vector" d="M0 0H100V100H0V0Z" fill="#5F5F5F"/>
                        <path id="Vector_2" d="M48 37.0001H52.8V45.3001H39.8V82.1001L39.5 82.2001C39 82.3001 32.9 82.3001 31.5 82.2001L30.4 82.1001V45.3001H17.4V37.0001H21.5C23.7 37.0001 29.5 37.0001 34.3 37.0001C39.3 37.0001 45.4 37.0001 48 37.0001ZM84.6 78.3001C82.7 80.3001 80.6 81.4001 77.2 82.4001C75.7 82.8001 75.5 82.8001 72.1 82.8001C68.8 82.8001 68.5 82.8001 66.9 82.4001C62.7 81.3001 59.3 79.2001 57 76.2001C56.3 75.4001 55.3 73.6001 55.3 73.4001C55.3 73.3001 55.5 73.2001 55.7 73.1001C55.9 73.0001 56.3 72.7001 56.7 72.5001C57 72.3001 57.7 71.9001 58.1 71.7001C58.5 71.5001 59.7 70.8001 60.8 70.1001C61.9 69.5001 62.8 68.9001 62.9 68.9001C63 68.9001 63.2 69.1001 63.4 69.4001C64.3 71.0001 66.5 73.0001 68.1 73.7001C69.1 74.1001 71.2 74.6001 72.2 74.6001C73.1 74.6001 74.9 74.2001 75.8 73.8001C76.8 73.3001 77.3 72.9001 77.9 72.0001C78.3 71.4001 78.4 71.2001 78.3 70.0001C78.3 68.9001 78.2 68.6001 77.9 68.0001C77 66.6001 75.8 65.8001 71 63.7001C66 61.5001 63.8 60.2001 62 58.4001C60.7 57.1001 60.4 56.7001 59.5 55.1001C58.4 53.0001 58.3 52.3001 58.3 49.2001C58.3 47.0001 58.3 46.3001 58.6 45.5001C58.9 44.4001 60 42.2001 60.5 41.7001C61.5 40.5001 61.9 40.2001 62.6 39.6001C64.7 37.8001 68 36.7001 71.2 36.6001C71.6 36.6001 72.7 36.7001 73.9 36.7001C77.1 37.0001 79.3 37.7001 81.4 39.4001C83 40.6001 85.4 43.6001 85.1 44.0001C84.9 44.2001 78.7 48.4001 78.3 48.5001C78.1 48.6001 77.9 48.5001 77.5 48.1001C75.4 45.6001 74.5 45.0001 72.5 44.9001C71 44.8001 70.3 45.0001 69.3 45.6001C68.3 46.3001 67.8 47.3001 67.8 48.8001C67.8 50.9001 68.6 51.9001 71.6 53.4001C73.5 54.4001 75.2 55.1001 75.3 55.1001C75.5 55.1001 79.5 57.1001 80.5 57.7001C85.4 60.6001 87.4 63.5001 87.9 68.6001C88 72.3001 87 75.8001 84.6 78.3001Z" fill="white"/>
                    </g>
                    <defs>
                        <clipPath id="clip0_790_10643">
                            <rect width="100" height="100" fill="white"/>
                        </clipPath>
                    </defs>
                </svg>
                <svg class="mx-2" width="30" height="30" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g id="tailwindcss">
                        <path id="Vector" d="M50 20C36.7 20 28.3 26.7 25 40C30 33.3 35.8 30.8 42.5 32.5C46.3 33.5 49 36.2 52 39.3C56.9 44.3 62.6 50 75 50C88.3 50 96.7 43.3 100 30C95 36.7 89.2 39.2 82.5 37.5C78.7 36.5 76 33.8 73 30.7C68.1 25.8 62.4 20 50 20ZM25 50C11.7 50 3.3 56.7 0 70C5 63.3 10.8 60.8 17.5 62.5C21.3 63.5 24 66.2 27 69.3C31.9 74.3 37.6 80 50 80C63.3 80 71.7 73.3 75 60C70 66.7 64.2 69.2 57.5 67.5C53.7 66.6 51 63.8 48 60.7C43.1 55.8 37.4 50 25 50Z" fill="#848484"/>
                    </g>
                </svg>
            </div>
            <hr class="h-px my-12 bg-light">
            <div class="flex justify-between">
                <a href="/static" class="sans-typo-detail hover:underline">Home</a>
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
                    Overview aside, you can take a deeper dive into what I ponder (and read more of these)
                    at my Bootleg SubStack, aptly dubbed <a href="/pond" class="underline decoration-wavy hover:text-stone-100">the pond</a>.
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
                <div class="flex pt-8">
                    <svg class="mr-2" width="30" height="30" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g id="sveltejs" clip-path="url(#clip0_790_10613)">
                            <path id="Vector" d="M86.0001 13.1999C76.7001 -0.100074 58.3001 -4.00007 45.0001 4.49993L21.7001 19.2999C20.1001 20.2999 18.7001 21.3999 17.3001 22.6999C16.0001 23.9999 14.8001 25.3999 13.7001 26.8999C12.6001 28.3999 11.8001 30.0999 11.1001 31.7999C10.4001 33.4999 9.90012 35.2999 9.60012 37.0999C9.30012 38.5999 9.20012 40.1999 9.20012 41.6999C9.20012 43.2999 9.30012 44.7999 9.50012 46.2999C9.70012 47.7999 10.1001 49.2999 10.6001 50.7999C11.1001 52.2999 11.7001 53.6999 12.4001 55.0999C11.9001 55.8999 11.4001 56.5999 11.0001 57.3999C10.6001 58.1999 10.2001 58.9999 9.90012 59.8999C9.60012 60.6999 9.30012 61.5999 9.00012 62.4999C8.80012 63.3999 8.50012 64.1999 8.40012 65.0999C7.80012 68.9999 7.90012 72.7999 8.70012 76.4999C9.10012 78.2999 9.70012 80.0999 10.5001 81.8999C11.3001 83.5999 12.2001 85.2999 13.3001 86.7999C22.6001 100.1 40.9001 104 54.2001 95.5999L77.5001 80.7999C79.1001 79.7999 80.5001 78.6999 81.9001 77.3999C83.2001 76.0999 84.4001 74.6999 85.5001 73.1999C86.5001 71.6999 87.4001 69.9999 88.1001 68.2999C88.8001 66.5999 89.3001 64.7999 89.7001 62.9999C90.0001 61.4999 90.1001 59.8999 90.1001 58.3999C90.1001 56.7999 90.0001 55.2999 89.8001 53.7999C89.6001 52.2999 89.2001 50.7999 88.7001 49.2999C88.2001 47.7999 87.6001 46.3999 86.9001 44.9999C87.4001 44.1999 87.9001 43.4999 88.3001 42.6999C88.7001 41.8999 89.1001 41.0999 89.4001 40.1999C89.7001 39.3999 90.0001 38.4999 90.3001 37.5999C90.5001 36.6999 90.8001 35.8999 90.9001 34.9999C91.2001 33.0999 91.4001 31.1999 91.3001 29.3999C91.3001 27.4999 91.0001 25.5999 90.6001 23.7999C90.2001 21.9999 89.6001 20.1999 88.8001 18.3999C88.0001 16.4999 87.1001 14.7999 86.0001 13.1999Z" fill="#717171"/>
                            <path id="Vector_2" d="M42.7999 88.1001C40.9999 88.6001 39.1 88.8001 37.2 88.7001C35.3 88.6001 33.5 88.2001 31.7 87.6001C29.9 86.9001 28.2999 86.0001 26.7999 84.9001C25.2999 83.7001 24 82.4001 22.9 80.8001C22.2 79.9001 21.7 78.9001 21.2 77.8001C20.7 76.8001 20.4 75.7001 20.1 74.6001C19.9 73.5001 19.7 72.4001 19.7 71.2001C19.7 70.1001 19.8 68.9001 20 67.8001C20 67.6001 20.1 67.4001 20.1 67.3001C20.1 67.1001 20.2 66.9001 20.2 66.8001C20.2 66.6001 20.2999 66.4001 20.2999 66.3001C20.3999 66.1001 20.4 65.9001 20.5 65.8001L20.9 64.5001L22.1 65.4001C22.8 65.9001 23.5 66.4001 24.2 66.8001C24.9 67.2001 25.7 67.7001 26.4 68.0001C27.2 68.4001 27.9 68.7001 28.7 69.0001C29.5 69.3001 30.3 69.6001 31.1 69.8001L32 70.1001L31.9 71.0001C31.9 71.6001 31.8999 72.2001 32.0999 72.8001C32.1999 73.1001 32.3 73.4001 32.4 73.7001C32.5 74.0001 32.7 74.2001 32.9 74.5001C33.2 75.0001 33.5999 75.4001 34.0999 75.7001C34.4999 76.0001 34.9999 76.3001 35.5999 76.5001C36.1999 76.7001 36.6999 76.8001 37.2999 76.8001C37.8999 76.8001 38.4 76.8001 39 76.6001C39.1 76.6001 39.3 76.5001 39.4 76.5001C39.5 76.5001 39.5999 76.4001 39.7999 76.4001C39.8999 76.3001 40 76.3001 40.2 76.2001C40.3 76.1001 40.4 76.1001 40.5 76.0001L63.7 61.0001C64 60.8001 64.3 60.6001 64.5 60.4001C64.7 60.2001 64.9999 59.9001 65.0999 59.6001C65.2999 59.3001 65.3999 59.0001 65.5999 58.7001C65.6999 58.4001 65.8 58.1001 65.9 57.7001C66 57.4001 66 57.0001 66 56.7001C66 56.4001 65.9 56.0001 65.9 55.7001C65.8 55.4001 65.6999 55.0001 65.5999 54.7001C65.4999 54.4001 65.2999 54.1001 65.0999 53.8001C64.7999 53.3001 64.4 52.9001 63.9 52.6001C63.5 52.3001 63 52.0001 62.4 51.8001C61.9 51.6001 61.3 51.5001 60.7 51.5001C60.1 51.5001 59.6 51.5001 59 51.7001C58.9 51.7001 58.6999 51.8001 58.5999 51.8001C58.4999 51.8001 58.4 51.9001 58.2 51.9001C58.1 52.0001 57.9999 52.0001 57.7999 52.1001C57.6999 52.2001 57.6 52.2001 57.5 52.3001L48.5999 58.0001C48.1999 58.2001 47.9 58.4001 47.5 58.7001C47.1 58.9001 46.6999 59.1001 46.2999 59.3001C45.8999 59.5001 45.4999 59.6001 45.0999 59.8001C44.6999 59.9001 44.3 60.1001 43.9 60.2001C42.1 60.7001 40.1999 60.9001 38.2999 60.8001C36.3999 60.7001 34.5999 60.3001 32.7999 59.7001C30.9999 59.0001 29.4 58.1001 27.9 57.0001C26.4 55.8001 25.1 54.5001 24 52.9001C23.3 52.0001 22.7999 51.0001 22.2999 49.9001C21.7999 48.9001 21.5 47.8001 21.2 46.7001C21 45.6001 20.7999 44.5001 20.7999 43.3001C20.7999 42.2001 20.9 41.0001 21.1 39.9001C21.5 37.7001 22.3 35.6001 23.6 33.7001C24.9 31.8001 26.5 30.3001 28.4 29.1001L51.7 14.3001C52.1 14.1001 52.3999 13.9001 52.7999 13.6001C53.1999 13.4001 53.6 13.2001 54 13.0001C54.4 12.8001 54.8 12.7001 55.2 12.5001C55.6 12.4001 56 12.2001 56.4 12.1001C58.2 11.6001 60.1 11.4001 62 11.5001C63.9 11.6001 65.7 12.0001 67.5 12.6001C69.3 13.3001 70.9 14.2001 72.4 15.3001C73.9 16.5001 75.2 17.8001 76.3 19.4001C77 20.3001 77.5 21.3001 78 22.4001C78.5 23.4001 78.7999 24.5001 79.0999 25.6001C79.3999 26.7001 79.5 27.8001 79.5 29.0001C79.5 30.1001 79.3999 31.3001 79.1999 32.4001C79.1999 32.6001 79.0999 32.8001 79.0999 32.9001C79.0999 33.1001 79 33.3001 79 33.4001C79 33.6001 78.9 33.8001 78.9 33.9001C78.8 34.1001 78.7999 34.3001 78.6999 34.4001L78.3 35.7001L77.0999 34.8001C76.3999 34.3001 75.7 33.8001 75 33.4001C74.3 33.0001 73.5 32.5001 72.8 32.2001C71.3 31.4001 69.6999 30.8001 68.0999 30.3001L67.1999 30.0001L67.3 29.1001C67.3 28.8001 67.3 28.5001 67.3 28.2001C67.3 27.9001 67.1999 27.6001 67.0999 27.3001C66.9999 27.0001 66.9 26.7001 66.8 26.4001C66.7 26.1001 66.5 25.9001 66.3 25.6001C66 25.1001 65.5999 24.7001 65.0999 24.4001C64.6999 24.1001 64.1999 23.8001 63.5999 23.6001C62.4999 23.2001 61.3999 23.2001 60.2999 23.5001C60.1999 23.5001 60 23.6001 59.9 23.6001C59.8 23.6001 59.7 23.7001 59.5 23.7001C59.4 23.8001 59.2999 23.8001 59.0999 23.9001C58.9999 24.0001 58.8999 24.0001 58.7999 24.1001L35.5 39.0001C35.2 39.2001 35 39.4001 34.7 39.6001C34.5 39.8001 34.1999 40.1001 34.0999 40.4001C33.8999 40.7001 33.7999 41.0001 33.5999 41.3001C33.4999 41.6001 33.3999 41.9001 33.2999 42.3001C33.1999 42.6001 33.2 43.0001 33.2 43.3001C33.2 44.0001 33.4 44.7001 33.7 45.3001C33.8 45.6001 34 45.9001 34.2 46.2001C34.5 46.7001 34.9 47.1001 35.4 47.4001C35.8 47.7001 36.3 48.0001 36.9 48.2001C38 48.6001 39.1 48.7001 40.2 48.4001C40.3 48.4001 40.4999 48.3001 40.5999 48.3001C40.6999 48.3001 40.8 48.2001 41 48.2001C41.1 48.1001 41.2 48.1001 41.4 48.0001C41.5 47.9001 41.6 47.9001 41.7 47.8001L50.5999 42.1001C50.9999 41.9001 51.3 41.6001 51.7 41.4001C52.1 41.2001 52.5 41.0001 52.9 40.8001C53.3 40.6001 53.6999 40.5001 54.0999 40.3001C54.4999 40.2001 54.8999 40.0001 55.2999 39.9001C57.0999 39.4001 59 39.2001 60.9 39.3001C62.8 39.4001 64.6 39.8001 66.4 40.4001C68.2 41.1001 69.8 42.0001 71.3 43.1001C72.8 44.3001 74.0999 45.6001 75.1999 47.2001C75.8999 48.1001 76.4 49.1001 76.9 50.2001C77.4 51.2001 77.7 52.3001 78 53.4001C78.3 54.5001 78.4 55.6001 78.4 56.8001C78.4 57.9001 78.2999 59.1001 78.0999 60.2001C77.8999 61.3001 77.5999 62.4001 77.1999 63.4001C76.7999 64.4001 76.2999 65.4001 75.5999 66.3001C74.9999 67.2001 74.3 68.1001 73.5 68.9001C72.7 69.7001 71.8 70.4001 70.9 71.0001L47.5 86.0001C47.1 86.2001 46.8 86.5001 46.4 86.7001C46 86.9001 45.6 87.1001 45.2 87.3001C44.8 87.5001 44.4 87.6001 44 87.8001C43.6 87.8001 43.1999 87.9001 42.7999 88.1001Z" fill="white"/>
                        </g>
                        <defs>
                            <clipPath id="clip0_790_10613">
                                <rect width="100" height="100" fill="white"/>
                            </clipPath>
                        </defs>
                    </svg>
                    <svg class="mx-2" width="30" height="30" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g id="astro">
                            <g id="astro_2">
                                <path id="Vector" d="M35.6962 85.1738C31.1941 81.0441 29.8798 72.3671 31.7555 66.0811C35.0079 70.0444 39.5143 71.2997 44.1821 72.0084C51.3881 73.1021 58.4652 72.6931 65.1592 69.3881C65.9248 69.0097 66.6325 68.5067 67.4692 67.9971C68.0975 69.8254 68.2608 71.6717 68.0415 73.5504C67.5082 78.1264 65.2388 81.6611 61.6292 84.3404C60.1858 85.4121 58.6585 86.3701 57.1678 87.3808C52.5885 90.4868 51.3495 94.1285 53.0701 99.4261C53.1111 99.5551 53.1478 99.6841 53.2401 99.9991C50.9018 98.9491 49.1941 97.4205 47.8928 95.4101C46.5181 93.2885 45.8641 90.9415 45.8298 88.4021C45.8125 87.1664 45.8125 85.9194 45.6468 84.7014C45.2425 81.7311 43.8531 80.4011 41.2351 80.3244C38.5485 80.2458 36.4232 81.9124 35.8597 84.5371C35.8167 84.7384 35.7543 84.9374 35.6919 85.1714L35.6962 85.1738Z" fill="#717171"/>
                                <path id="Vector_2" d="M10 65.0336C10 65.0336 23.3316 58.5166 36.7005 58.5166L46.7801 27.2146C47.1574 25.7008 48.2594 24.672 49.5031 24.672C50.7471 24.672 51.8491 25.7008 52.2264 27.2146L62.3061 58.5166C78.1395 58.5166 89.0065 65.0336 89.0065 65.0336C89.0065 65.0336 66.3618 3.13218 66.3175 3.00798C65.6675 1.17784 64.5705 -0.000854492 63.0911 -0.000854492H35.9178C34.4385 -0.000854492 33.3856 1.17784 32.6914 3.00798C32.6425 3.12983 10 65.0336 10 65.0336Z" fill="white"/>
                            </g>
                        </g>
                    </svg>
                    <svg class="mx-2" width="30" height="30" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g id="html5">
                            <path id="Vector" d="M14 90L6 0H94.2L86.2 90L50 100" fill="#767676"/>
                            <path id="Vector_2" d="M50.1 92.2998V7.2998H86.1L79.2 84.0998" fill="#888888"/>
                            <path id="Vector_3" d="M22.4 18.3999H50.1V29.3999H34.5L35.5 40.6999H50.1V51.6999H25.4L22.4 18.3999ZM25.9 57.2999H37L37.8 66.0999L50.1 69.3999V80.8999L27.4 74.5999" fill="#EBEBEB"/>
                            <path id="Vector_4" d="M77.7 18.3999H50V29.3999H76.6L77.7 18.3999ZM75.7 40.6999H50V51.6999H63.6L62.3 65.9999L50 69.3999V80.8999L72.6 74.5999" fill="white"/>
                        </g>
                    </svg>
                    <svg class="mx-2" width="30" height="30" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g id="typescript" clip-path="url(#clip0_790_10643)">
                            <path id="Vector" d="M0 0H100V100H0V0Z" fill="#5F5F5F"/>
                            <path id="Vector_2" d="M48 37.0001H52.8V45.3001H39.8V82.1001L39.5 82.2001C39 82.3001 32.9 82.3001 31.5 82.2001L30.4 82.1001V45.3001H17.4V37.0001H21.5C23.7 37.0001 29.5 37.0001 34.3 37.0001C39.3 37.0001 45.4 37.0001 48 37.0001ZM84.6 78.3001C82.7 80.3001 80.6 81.4001 77.2 82.4001C75.7 82.8001 75.5 82.8001 72.1 82.8001C68.8 82.8001 68.5 82.8001 66.9 82.4001C62.7 81.3001 59.3 79.2001 57 76.2001C56.3 75.4001 55.3 73.6001 55.3 73.4001C55.3 73.3001 55.5 73.2001 55.7 73.1001C55.9 73.0001 56.3 72.7001 56.7 72.5001C57 72.3001 57.7 71.9001 58.1 71.7001C58.5 71.5001 59.7 70.8001 60.8 70.1001C61.9 69.5001 62.8 68.9001 62.9 68.9001C63 68.9001 63.2 69.1001 63.4 69.4001C64.3 71.0001 66.5 73.0001 68.1 73.7001C69.1 74.1001 71.2 74.6001 72.2 74.6001C73.1 74.6001 74.9 74.2001 75.8 73.8001C76.8 73.3001 77.3 72.9001 77.9 72.0001C78.3 71.4001 78.4 71.2001 78.3 70.0001C78.3 68.9001 78.2 68.6001 77.9 68.0001C77 66.6001 75.8 65.8001 71 63.7001C66 61.5001 63.8 60.2001 62 58.4001C60.7 57.1001 60.4 56.7001 59.5 55.1001C58.4 53.0001 58.3 52.3001 58.3 49.2001C58.3 47.0001 58.3 46.3001 58.6 45.5001C58.9 44.4001 60 42.2001 60.5 41.7001C61.5 40.5001 61.9 40.2001 62.6 39.6001C64.7 37.8001 68 36.7001 71.2 36.6001C71.6 36.6001 72.7 36.7001 73.9 36.7001C77.1 37.0001 79.3 37.7001 81.4 39.4001C83 40.6001 85.4 43.6001 85.1 44.0001C84.9 44.2001 78.7 48.4001 78.3 48.5001C78.1 48.6001 77.9 48.5001 77.5 48.1001C75.4 45.6001 74.5 45.0001 72.5 44.9001C71 44.8001 70.3 45.0001 69.3 45.6001C68.3 46.3001 67.8 47.3001 67.8 48.8001C67.8 50.9001 68.6 51.9001 71.6 53.4001C73.5 54.4001 75.2 55.1001 75.3 55.1001C75.5 55.1001 79.5 57.1001 80.5 57.7001C85.4 60.6001 87.4 63.5001 87.9 68.6001C88 72.3001 87 75.8001 84.6 78.3001Z" fill="white"/>
                        </g>
                        <defs>
                            <clipPath id="clip0_790_10643">
                                <rect width="100" height="100" fill="white"/>
                            </clipPath>
                        </defs>
                    </svg>
                    <svg class="mx-2" width="30" height="30" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g id="tailwindcss">
                            <path id="Vector" d="M50 20C36.7 20 28.3 26.7 25 40C30 33.3 35.8 30.8 42.5 32.5C46.3 33.5 49 36.2 52 39.3C56.9 44.3 62.6 50 75 50C88.3 50 96.7 43.3 100 30C95 36.7 89.2 39.2 82.5 37.5C78.7 36.5 76 33.8 73 30.7C68.1 25.8 62.4 20 50 20ZM25 50C11.7 50 3.3 56.7 0 70C5 63.3 10.8 60.8 17.5 62.5C21.3 63.5 24 66.2 27 69.3C31.9 74.3 37.6 80 50 80C63.3 80 71.7 73.3 75 60C70 66.7 64.2 69.2 57.5 67.5C53.7 66.6 51 63.8 48 60.7C43.1 55.8 37.4 50 25 50Z" fill="#848484"/>
                        </g>
                    </svg>
                </div>
                <hr class="h-px my-12 bg-light">
                <div class="flex justify-between">
                    <a href="/static" class="sans-typo-detail hover:underline">Home</a>
                    <a href="/now" class="sans-typo-detail hover:underline">Now</a>
                </div>
            </div>
        </div>
    </div>
{/if}
