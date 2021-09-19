class AbstractView {

    constructor() {
        this.container = document.getElementById("container");
        this.filtersArray = {};
    }

    display(content) {
        this.container.innerHTML = content;
    }
}