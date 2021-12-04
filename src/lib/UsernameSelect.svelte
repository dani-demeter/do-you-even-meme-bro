<script>
    export let username;
    let tempUsername = "";
    const cookieName = "meme-username";
    import { onMount } from "svelte";
    onMount(() => {
        var cookieUsername = getCookie(cookieName);
        if (cookieUsername != null) {
            username = cookieUsername;
        }
    });

    function setUsername() {
        username = tempUsername;
        setCookie(cookieName, tempUsername);
    }

    function getCookie(name) {
        var cookie = document.cookie;
        var prefix = name + "=";
        var begin = cookie.indexOf("; " + prefix);
        if (begin == -1) {
            begin = cookie.indexOf(prefix);
            if (begin != 0) return null;
        } else {
            begin += 2;
            var end = document.cookie.indexOf(";", begin);
            if (end == -1) {
                end = cookie.length;
            }
        }
        return unescape(cookie.substring(begin + prefix.length, end));
    }

    function setCookie(name, value) {
        console.log(document.cookie);
        document.cookie = `${name}=${value}`;
    }
</script>

<div class="container-fluid" style="height: 100vh">
    <div
        class="row align-items-center justify-content-center text-center"
        style="height: 100vh"
    >
        <div class="col-12 col-md-6">
            <span class="h1">Please choose a username:</span>
            <input
                bind:value={tempUsername}
                style="width: 100%"
                class="form-control form-control-lg mt-3"
                type="text"
                placeholder="MemerMan"
            />
            <button
                on:click={setUsername}
                class:disabled={tempUsername.length == 0 ||
                    tempUsername.indexOf(" ") >= 0}
                class="btn btn-primary mt-5">Save</button
            >
        </div>
    </div>
</div>
