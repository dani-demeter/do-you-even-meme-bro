<script>
    export let username;
	import { base } from '$app/paths';

    let roomName = "";

    function joinRoom(){
        location.href = "/room/"+roomName;
    }

    function onKeyPress(e){
        if (e.charCode === 13){
            joinRoom();
        }
    }

</script>

<div class="h1 mb-5">Welcome, {username}!</div>
<div class="h5">Join or create a room!</div>
<input
    bind:value={roomName}
    on:keypress={onKeyPress}
    style="width: 100%"
    class="form-control form-control-lg mt-3 mb-3"
    type="text"
    placeholder="Room Name"
/>
<div class="text-end">
    <button class="btn btn-primary" on:click={joinRoom}>Join Room</button>
</div>
