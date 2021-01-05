async function loadUsersChoices() {
    let choices = [];
    let response = await axios.get("/api/get_users/usernames");
    choices = response.data.usernames;
    $("#new-collab-user").autocomplete({ source: choices });
}

$(function() {
    loadUsersChoices();
})