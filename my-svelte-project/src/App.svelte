<script>
	/////////////////////////////client/////////////////////////////
	/////////////////////////////client/////////////////////////////
	/////////////////////////////client/////////////////////////////
	
	
	
const test_app5_text = `https://www.google.com
https://www.amazon.co.jp
https://www.apple.com/jp
https://www.microsoft.com/ja-jp
https://www.facebook.com`;

let is_editing_app5_title = false;
let url_list = '';


		let open_volume = 1;
		let url_list_lines = [];
		let options = [];
		let urls = [];

		// Reactive updates
		$: {
			url_list_lines = url_list.split('\n').filter(line => line.trim() !== '');
			if (url_list_lines.length > 100) {
				error_message = 'URLリストは100行までです。';
			} else {
				error_message = '';
			}
			options = Array.from({ length: url_list_lines.length }, (_, i) => i + 1);
			if (options.length > 0) {
				open_volume = Math.max(open_volume, options[options.length - 1]);
			}
		}
		function service_tab_open(url) {
			window.open(url, '_blank');
		}
		async function service_exe() {
			urls = url_list_lines.slice(0, open_volume);
			urls.forEach(url => service_tab_open(url));
		}
		function service_toggle_edit_app5_title() {
			is_editing_app5_title = !is_editing_app5_title;
		}
		function service_update_app5_title() {
			is_editing_app5_title = false;
		}
	/////////////////////////////client/////////////////////////////
	/////////////////////////////client/////////////////////////////
	/////////////////////////////client/////////////////////////////


	let app5_title = 'GAFAM';
let app5_text = `https://www.google.com
https://www.amazon.com
https://www.apple.com
https://www.microsoft.com
https://www.facebook.com`;
let convert_data_0 = null;
let convert_data_1 = null;

// convert_dataの引数の初期値をapp5_title, app5_textに設定
function convert_data(data_0 = app5_title, data_1 = app5_text) {
    convert_data_0 = data_0;
    convert_data_1 = data_1;
}

const service_name = 'app5';
	
	
	
	
	
	import { onMount } from 'svelte';
		const firebase_config = {
			apiKey: "AIzaSyBcOlIDP2KWbJuKM0WeMHNp-WvjTVfLt9Y",
			authDomain: "p2auth-ea50a.firebaseapp.com",
			projectId: "p2auth-ea50a",
			storageBucket: "p2auth-ea50a.appspot.com",
			messagingSenderId: "796225429484",
			appId: "1:796225429484:web:ece56ef2fc0be28cd6eac9"
		};
		firebase.initializeApp(firebase_config);
		const google_provider = new firebase.auth.GoogleAuthProvider();
		let error_message = '';
		let user = null;
		let uid = "";
		let login_result = 'Not logged in';
		let web_data = [];
	
		function check_login() {
			firebase.auth().onAuthStateChanged(current_user => {
				user = current_user;
				if (user) {
					login_result = `Logged in as: ${user.displayName}`;
					uid = user.uid;
					fetch_data(); // Refresh the data
				} else {
					login_result = 'Not logged in';
					uid = "";
				}
			});
		}
	
		function google_login() {
			firebase.auth().signInWithPopup(google_provider).then(result => {
				user = result.user;
				login_result = `Logged in as: ${user.displayName}`;
			}).catch(error => {
				console.error('Error during Google login:', error);
				alert('Google login failed. ' + error.message);
			});
		}
	
		function sign_out() {
			firebase.auth().signOut().then(() => {
				user = null;
				login_result = 'Not logged in';
			}).catch(error => {
				console.error('Error during sign-out:', error);
				alert('Sign out failed. ' + error.message);
			});
		}
	
		async function fetch_data() {
    try {
        console.log('fetch_data');
        const response = await fetch('https://cotton-concrete-catsup.glitch.me/app5/read', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ uid })
        });
        const data = await response.json();
        web_data = data.all_json;
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

async function create_record() {
    try {
        convert_data(app5_title, app5_text);
        const response = await fetch('https://cotton-concrete-catsup.glitch.me/app5/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                uid: uid,
                app5_title: convert_data_0,
                app5_text: convert_data_1,
            })
        });
        const data = await response.json();
        console.log('Record created:', data);
        fetch_data(); // Refresh the data
    } catch (error) {
        console.error('Error creating record:', error);
    }
}

async function update_record(id) {
    try {
        convert_data(app5_title, app5_text);
        // confirmしてから実行。yes出ない場合は何もしない
        if (confirm('更新しますか？')) {
            const response = await fetch('https://cotton-concrete-catsup.glitch.me/app5/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: id,
                    uid: uid,
                    app5_title: convert_data_0,
                    app5_text: convert_data_1,
                })
            });
            const data = await response.json();
            console.log('Record updated:', data);
            fetch_data(); // Refresh the data
        } else {
            return;
        }
    } catch (error) {
        console.error('Error updating record:', error);
    }
}

async function delete_record(id) {
    try {
        const response = await fetch('https://cotton-concrete-catsup.glitch.me/app5/delete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id, uid })
        });
        const data = await response.json();
        console.log('Record deleted:', data);
        fetch_data(); // Refresh the data
    } catch (error) {
        console.error('Error deleting record:', error);
    }
}

	
		onMount(() => {
			check_login();
			fetch_data();
		});
	/////////////////////////////server/////////////////////////////
	/////////////////////////////server/////////////////////////////
	/////////////////////////////server/////////////////////////////
	</script>
	
	<style>
		.container {
			display: flex;
			flex-direction: column;
			align-items: center;
			padding: 20px;
		}
		.header {
			display: flex;
			justify-content: space-between;
			width: 100%;
		}
		.content {
			display: flex;
			width: 100%;
		}
		.left-column, .right-column {
			flex: 1;
			padding: 10px;
		}
		textarea {
			width: 100%;
			height: 50vh;
		}
	</style>
	
	<div class="container">
	
	
	<div class="header">
		<h1>{service_name}</h1>
		{#if user}
			<button on:click={sign_out}>Logout</button>
		{:else}
			<button on:click={google_login}>Login</button>
		{/if}
	</div>
	<div class="content">
		<div class="left-column server_side">
			<div class="console">
				{#if error_message}
				<button id="error_message" on:click={() => error_message = ''} on:keydown={(e) => { if (e.key === 'Enter' || e.key === ' ') error_message = ''; }} style="background: none; border: none; padding: 0; margin: 0; color: inherit; font: inherit; cursor: pointer;">
					{error_message}
				</button>
				{/if}
				<p>{login_result}</p>
				<p>{app5_title}</p>
				{#if user}
				<button on:click={create_record}>Create Record</button>
				{/if}
				<p>uid: {uid}</p>
			</div>
			<div class="list">
				<ul>
					{#each web_data as item}
						<li>
							{item.app5_title}
							<button on:click={() => app5_text = item.app5_text}>Load</button>
							<!-- ログアウト状態ではupdateとdeleteは非表示 -->
							{#if user}
							<button on:click={() => update_record(item.id)}>Update</button>
							<button on:click={() => delete_record(item.id)}>Delete</button>
							{/if}
						</li>
					{/each}
				</ul>
			</div>
		</div>
		
	
		<div class="right-column">
			{#if is_editing_app5_title}
				<input type="text" bind:value={app5_title} />
				<button on:click={service_update_app5_title}>Update</button>
			{:else}
				<button on:click={service_toggle_edit_app5_title}>Change Title</button>
			{/if}
			<!-- test_app5_textを代入するボタン -->
			<button on:click={() => app5_text = test_app5_text}>Test Text List</button>
			<label for="open_volume">Open Volume:</label>
			<input type="number" id="open_volume" bind:value={open_volume} min="1" max={options.length} />
			<textarea bind:value={app5_text} placeholder="Enter text list here"></textarea>
			<button on:click={service_exe}>実行</button>
		</div>
		

	</div>
	
	
	</div>