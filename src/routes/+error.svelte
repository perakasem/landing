<!-- src/routes/+error.svelte -->
<script>
    export let error;
    export let status;
</script>

<svelte:head>
    <title>{status} – Page Not Found</title>
</svelte:head>

<main class="error-page">
    <h1>{status}</h1>
    {#if status === 404}
        <p>Sorry, the page you are looking for doesn't exist.</p>
    {:else}
        <p>{error.message}</p>
    {/if}
    <a href="/static" class="home-link">Go back home</a>
</main>

<style>
    .error-page {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        text-align: center;
        padding: 2rem;
    }
    .home-link {
        margin-top: 1.5rem;
        padding: 0.5rem 1rem;
        background-color: #5468ff;
        color: white;
        text-decoration: none;
        border-radius: 4px;
    }
</style>
