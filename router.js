function goToRoute(page, ...arguments) {

    let controller = new Controller;

    switch(page) {
        case "viewMainPage":
            controller.renderMainPage()
            break;
            
        default : 
        //controller.renderErrorPage
    }
}

goToRoute("viewMainPage");