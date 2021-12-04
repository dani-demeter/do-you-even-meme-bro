<script>
    import { page } from '$app/stores';
</script>

<div class="row">
    <div class="col">
        <div class="h5">Room: {$page.params.slug}</div>
    </div>
    <div class="col">
        <a href="/" class="btn btn-secondary">Leave Room</a>
    </div>
</div>