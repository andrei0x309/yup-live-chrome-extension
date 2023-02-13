import "./popup.scss"
import Entry from "@/pages/Entry.svelte";
// import { storage } from "src/storage";

const target = document.getElementById("app");

function render() {
    // storage.get().then(({ count }) => {
        new Entry({target});
    // });
}

document.addEventListener("DOMContentLoaded", render);
