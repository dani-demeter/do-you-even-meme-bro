<script>
    export let username;

    let roomName = "";
</script>

<div class="h1 mb-5">Welcome, {username}!</div>
<div class="h5">Join or create a room!</div>
<input
    bind:value={roomName}
    style="width: 100%"
    class="form-control form-control-lg mt-3 mb-3"
    type="text"
    placeholder="Room Name"
/>
<div class="text-end">
    <a href={"/room/"+roomName} role="button" class="btn btn-primary">Join Room</a>
</div>
