<script lang="ts">
    import { slide } from 'svelte/transition';

    type MenuItem = {
        id: string;
        label: string;
        isAbsolute?: boolean;
        content: {
            href?: string;
            label: string;
            external?: boolean;
        }[];
    };

    const menuItems: MenuItem[] = [
        {
            id: 'about',
            label: 'About',
            content: [
                { label: 'Resumé' }
            ]
        },
        {
            id: 'works',
            label: 'Works',
            content: [
                { href: 'https://perakasem.crd.co', label: 'Photography', external: true },
                { href: 'https://perakasem.crd.co', label: 'Playground', external: true },
                { href: 'https://quatre.vercel.app', label: 'Quatre', external: true }
            ]
        },
        {
            id: 'connect',
            label: 'Connect',
            isAbsolute: true,
            content: [
                { href: 'https://instagram.com/perakasem', label: 'Instagram', external: true },
                { href: 'https://github.com/perakasem', label: 'Github', external: true },
                { href: 'https://linkedin.com/in/perakasem', label: 'LinkedIn', external: true },
                { href: 'mailto:pkasemsripitak@gmail.com', label: 'Email' }
            ]
        }
    ];

    let activeSection: string | null = null;

    const toggleSection = (id: string) => {
        activeSection = activeSection === id ? null : id;
    };
</script>

<div>
    <div>Pera Kasemsripitak</div>

    {#each menuItems as item}
        <div class="relative">
            <a
                href={'#'}
                on:click|preventDefault={() => toggleSection(item.id)}
                class="block text-left cursor-pointer {activeSection === item.id ? 'underline' : ''}"
            >
                {item.label}
            </a>
            {#if activeSection === item.id}
                <div class={item.isAbsolute ? 'absolute' : ''}>
                    <div transition:slide class="pl-6">
                        {#each item.content as content}
                            <div>
                                {#if content.href}
                                    <a
                                        href={content.href}
                                        target={content.external ? "_blank" : undefined}
                                        rel={content.external ? "noopener noreferrer" : undefined}
                                        class="self-start"
                                    >
                                    {content.label}
                                    </a>
                                {:else}
                                    {content.label}
                                {/if}
                            </div>
                        {/each}
                    </div>
                </div>
            {/if}
        </div>
    {/each}
</div>