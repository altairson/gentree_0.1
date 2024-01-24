$(document).ready(function() {
    var main = $("#main");
    var editor = $('#editor');
    var base = $('#base');
    var sensitivity = 5; // Adjust the sensitivity based on your preference
    var topScroll = false;
    var bottomScroll = false;
    var leftScroll = false;
    var rightScroll = false;

    var letters_string = "abcdefghijklmnopqrstuvwxyz";
    var letters_array = letters_string.split('');

    var DRAG_OPTION = false;
    var DRAG_KEY_DOWN = false;
    var PARENT;
    var CHILDREN = [];
    var TYPE = "male";

    var DATA_ARRAY = [];

    $(".loading").click(function() {
        $(".loading").addClass('hidden');
    })

    $("#sideList").click(function() {
        $("#sideList").toggleClass("closed");
        $(".handle").toggleClass("opened");
        if($("#sideList").hasClass("closed")) {
            $(".fa-list").removeClass("icon-active");
        }
        else {
            $(".fa-list").addClass("icon-active");
        }
    })

    
    


    editor.mousemove(function(e) {
        base[0].style.left = (e.clientX - 40) + "px";
        base[0].style.top = (e.clientY - 15) + "px";
    })

    function CollectAllDataToBeSaved() {
        var DATA_ARRAY = [];
        let boxes = $(".box");
        for(let i = 0; i < boxes.length; i++) {
            let obj = {
                
            }
        }
    }


    function dragElement(elmnt) {
        var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        elmnt.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            if(!DRAG_OPTION) {
                return;
            }
            e = e || window.event;
            e.preventDefault();
            // get the mouse cursor position at startup:
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            // call a function whenever the cursor moves:
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();

            // calculate the new cursor position:
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;

            // // set the element's new position:
            // elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
            // elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";

            let boxes = CHILDREN;
            for (let i = 0; i < boxes.length; i++) {
                boxes[i].style.top = (boxes[i].offsetTop - pos2) + "px";
                boxes[i].style.left = (boxes[i].offsetLeft - pos1) + "px";
            }

            moveLines(elmnt.classList[0], pos1, pos2);
        }

        function closeDragElement() {
            /* stop moving when mouse button is released:*/
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    function moveLines(clas, pos1, pos2) {
        // move all children lines
        let prefix = "l_" + clas;
        let lines = $('[class^="' + prefix + '"]');

        for (let i = 0; i < lines.length; i++) {
            if (lines[i].classList[0] == prefix) {
                lines[i].attributes.x2.value = parseInt(lines[i].attributes.x2.value) - pos1;
                lines[i].attributes.y2.value = parseInt(lines[i].attributes.y2.value) - pos2;
            }
            else {
                lines[i].attributes.x1.value = parseInt(lines[i].attributes.x1.value) - pos1;
                lines[i].attributes.y1.value = parseInt(lines[i].attributes.y1.value) - pos2;
                lines[i].attributes.x2.value = parseInt(lines[i].attributes.x2.value) - pos1;
                lines[i].attributes.y2.value = parseInt(lines[i].attributes.y2.value) - pos2;
            }
        }
    }



    function scrollTop() {
        main.scrollTop(main.scrollTop() - sensitivity);
        console.log(main.scrollTop());
        if(topScroll) {
            setTimeout(scrollTop, 25);
        }
    }

    function scrollBottom() {
        main.scrollTop(main.scrollTop() + sensitivity);
        console.log(main.scrollTop());
        if(bottomScroll) {
            setTimeout(scrollBottom, 25);
        }
    }

    function scrollLeft() {
        main.scrollLeft(main.scrollLeft() - sensitivity);
        console.log(main.scrollLeft());
        if(leftScroll) {
            setTimeout(scrollLeft, 25);
        }
    }

    function scrollRight() {
        main.scrollLeft(main.scrollLeft() + sensitivity);
        console.log(main.scrollLeft());
        if(rightScroll) {
            setTimeout(scrollRight, 25);
        }
    }
   


    $(".top").mouseenter(function() {
        topScroll = true;
        scrollTop();
    })

    $(".top").mouseleave(function(e) {
        topScroll = false;
    })

    $(".bottom").mouseenter(function(e) {
        
        bottomScroll = true;
        scrollBottom();
    })

    $(".bottom").mouseleave(function(e) {
        bottomScroll = false;
    })

    $(".left").mouseenter(function(e) {
        leftScroll = true;
        scrollLeft();
    })

    $(".left").mouseleave(function(e) {
        leftScroll = false;
    })

    $(".right").mouseenter(function(e) {
        rightScroll = true;
        scrollRight();
    })

    $(".right").mouseleave(function(e) {
        rightScroll = false;
    })


    editor.mousedown(function(e) {
        $("#selectType")[0].style.top = (e.offsetY + 15) + "px";
        $("#selectType")[0].style.left = (e.offsetX - 75) + "px";
        $("#selectType").removeClass("hidden");
        console.log("mousedown");
    })

    editor.mouseup(function(e) {
        let type = $(".selected-type")[0];
        TYPE = type == undefined ? "male" : type.classList[1];
        $("#selectType").addClass("hidden");
        console.log("mouseup");
    })

    editor.click(function(e) {
        createBox(e.offsetX - 40, e.offsetY - 15, TYPE);
    })

    $(".type").mouseenter(function() {
        $(this).addClass("selected-type");
    })

    $(".type").mouseleave(function() {
        $(this).removeClass("selected-type");
    })

    function findAllChildren(parent_class) {
        var prefix = parent_class;

        // select all elements that starts with parent element class
        var children = $('[class^="' + prefix + '"]');
        return children;
    }

    function findAvailableClassName(parent_class) {
        var prefix = parent_class;
        var lengthToMatch = parent_class.length + 1;


        // select all elements that starts with parent element class
        var elements = $('[class^="' + prefix + '"]');

        let occupied_letters = [];
        for(let i = 0; i < elements.length; i++) {
            let class_name = elements[i].classList[0];
            if(class_name.length == lengthToMatch) {
                let occupied_letter = class_name[class_name.length - 1];
                occupied_letters.push(occupied_letter);
            }
        }

        // subtract  occupied letters from all letters to define which letters are available
        let free_letters = letters_array.filter(function(element) {
            return !occupied_letters.includes(element);
        });

        // and then return first available letter 
        return free_letters[0];
    }

    function connectWithLine(parent, child, class_name, isWife) {
        var line = document.createElementNS('http://www.w3.org/2000/svg','line');
        line.classList.add("l_" + class_name);
        line.classList.add("line");
        let x1 = parent.offsetLeft + 40;
        let y1 = parent.offsetTop + 15;
        if(isWife && $(".focused-bond")[0] != undefined) {
            x1 = $(".focused-bond")[0].offsetLeft + 5;
            y1 = $(".focused-bond")[0].offsetTop + 3;
        }
        line.setAttribute('x1', x1);
        line.setAttribute('y1', y1);
        line.setAttribute('x2', child.offsetLeft + 40);
        line.setAttribute('y2', child.offsetTop + 15);
        line.setAttribute('stroke', "black");

        $("#lines").append(line);
    }

    function createConnection(father, mother) {
        let circle = document.createElement("DIV");
        circle.classList.add("bond");
        let class_name = "b-" + mother.classList[0];
        circle.classList.add(class_name);
        if($(".focused-bond")[0] != undefined) {
            $(".focused-bond").removeClass("focused-bond");
        }
        circle.classList.add("focused-bond");
        let father_x = parseInt(father.style.left.split("px")[0]) + 80;
        let father_y = parseInt(father.style.top.split("px")[0]) + 15;
        let mother_x = parseInt(mother.style.left.split("px")[0]);
        let mother_y = parseInt(mother.style.top.split("px")[0]);

        let center_x = father_x + ((mother_x - father_x) / 2);
        let center_y = father_y + ((mother_y - father_y) / 2) + 3;


        circle.style.top =  center_y + "px";
        circle.style.left = center_x + "px";
        editor.append(circle);
    }

    editor.on("click", ".bond", function(e) {
        e.stopPropagation();
        if($(".focused-bond")[0] != undefined) {
            $(".focused-bond").removeClass("focused-bond");
        }
        $(this).addClass("focused-bond");
    })


    function createBox(x, y, type="male") {
        // check if this is first box
        if($(".box")[0] == undefined) {
            // first box
            let div = document.createElement("DIV");
            div.classList.add("a");
            div.classList.add("box");
            div.classList.add(type);
            div.classList.add("focused");
            div.style.top = y + "px";
            div.style.left = x + "px";

            let input = document.createElement("INPUT");
            input.classList.add("name");
            div.append(input);
            editor.append(div);
            input.focus();
        }
        else {
            let parent_class = $(".focused")[0].classList[0];
            let new_class_ending = findAvailableClassName(parent_class);
            let new_class = parent_class + new_class_ending;
            let div = document.createElement("DIV");
            div.classList.add(new_class);
            div.classList.add("box");
            div.classList.add(type);

            if(type == "wife") {

                let mother_y = $(".focused")[0].style.top.split("px")[0];
                let mother_x = parseInt($(".focused")[0].style.left.split("px")[0]);

                if(mother_x < x) {
                    mother_x += 150;
                }
                else {
                    mother_x -= 150;
                }
                div.style.top = mother_y + "px";
                div.style.left = mother_x + "px";
                createConnection($(".focused")[0], div);
            }
            else {
                div.style.top = y + "px";
                div.style.left = x + "px";
            }
            

            let input = document.createElement("INPUT");
            input.classList.add("name");
            div.append(input);

            editor.append(div);
            connectWithLine($(".focused")[0], div, new_class, type != "wife");
            input.focus();
        }
        
    }

    editor.on("mousedown", ".box", function(e) {
        e.stopPropagation();

        if($(".focused")[0] != undefined) {
            $(".focused").removeClass("focused");
        }
        if($(".focused-bond")[0] != undefined) {
            $(".focused-bond").removeClass("focused-bond");
        }


        if($(this).hasClass("wife")) {
            let class_name = $(this)[0].classList[0];
            let bond = $(`.b-${class_name}`)[0];
            bond.classList.add("focused-bond");
            console.log("mother class = " + class_name);
            let father_class = class_name.slice(0, class_name.length - 1);
            $(`.${father_class}`)[0].classList.add("focused");
            console.log("father class = " + father_class);
        }
        else {
            $(this).addClass("focused");
        }
        

        if(DRAG_OPTION) {
            // define parent and children
            PARENT = $(".focused")[0];
            CHILDREN = findAllChildren(PARENT.classList[0]);

            dragElement(PARENT);
        }
    })

    editor.on("click", ".box", function(e) {
        e.stopPropagation();
    })


    $(".fa-solid").click(function() {
        $(this).toggleClass("icon-active");
        if($(this).hasClass("fa-up-down-left-right")) {
            if($(this).hasClass("icon-active")) {
                DRAG_OPTION = true;
                dragElement($(".focused")[0]);
            }
            else {
                DRAG_OPTION = false;
            }
            
        }
        else if($(this).hasClass("fa-list")) {
            if($(this).hasClass("icon-active")) {
                $("#sideList").removeClass("closed");
                $(".handle").addClass("opened");
            }
            else {
                $("#sideList").addClass("closed");
                $(".handle").removeClass("opened");
            }
        }
    })



});