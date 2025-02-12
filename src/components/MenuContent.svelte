<!-- src/components/MenuContent.svelte -->
<script lang="ts">
    import { slide } from 'svelte/transition';

    // Local state for toggling the sections
    let showAbout: boolean = false;
    let showWorks: boolean = false;
    let showConnect: boolean = false;

    const toggleSection = (section: string) => {
        if (section === 'about') {
            showAbout = !showAbout;
            showWorks = false;
            showConnect = false;
        } else if (section === 'works') {
            showWorks = !showWorks;
            showAbout = false;
            showConnect = false;
        } else if (section === 'connect') {
            showConnect = !showConnect;
            showAbout = false;
            showWorks = false;
        }
    };
</script>

<!-- Menu Content Markup -->
<div>
    <div>Pera Kasemsripitak</div>

    <!-- About Section -->
    <div class="relative">
        <a
                href="#"
                on:click|preventDefault={() => toggleSection('about')}
                class="block text-left cursor-pointer {showAbout ? 'underline' : ''}"
        >
            About
        </a>
        {#if showAbout}
            <div transition:slide class="pl-6">
                <div>Resumé</div>
            </div>
        {/if}
    </div>

    <!-- Works Section -->
    <div class="relative">
        <a
                href="#"
                on:click|preventDefault={() => toggleSection('works')}
                class="block text-left cursor-pointer {showWorks ? 'underline' : ''}"
        >
            Works
        </a>
        {#if showWorks}
            <div transition:slide class="pl-6">
                <div>
                    <a
                            href="https://perakasem.crd.co"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="self-start"
                    >
                        Photography
                    </a>
                </div>
            </div>
        {/if}
    </div>

    <!-- Connect Section -->
    <div class="relative">
        <a
                href="#"
                on:click|preventDefault={() => toggleSection('connect')}
                class="block text-left cursor-pointer {showConnect ? 'underline' : ''}"
        >
            Connect
        </a>
        {#if showConnect}
            <div class="absolute">
                <div transition:slide class="pl-6">
                    <div>
                        <a
                                href="https://instagram.com/perakasem"
                                target="_blank"
                                rel="noopener noreferrer"
                                class="self-start"
                        >
                            Instagram
                        </a>
                    </div>
                    <div>
                        <a
                                href="https://github.com/perakasem"
                                target="_blank"
                                rel="noopener noreferrer"
                                class="self-start"
                        >
                            Github
                        </a>
                    </div>
                    <div>
                        <a
                                href="https://linkedin.com/in/perakasem"
                                target="_blank"
                                rel="noopener noreferrer"
                                class="self-start"
                        >
                            LinkedIn
                        </a>
                    </div>
                    <div>
                        <a href="mailto:pkasemsripitak@gmail.com" class="self-start">
                            Email
                        </a>
                    </div>
                </div>
            </div>
        {/if}
    </div>
</div>

<style>
    /* Optional: Add any menu-specific styling here */
</style>
