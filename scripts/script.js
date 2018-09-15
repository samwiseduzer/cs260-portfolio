
// init flags
let currPage = 'intro';

// setup listeners & navigation system
const navBtns = document.querySelectorAll('[nav-to]');
const pages = document.querySelectorAll('.page');

const forEach = (nodeList,fn) => {
    for(let i = 0; i < nodeList.length; i++){
        fn(nodeList[i]);
    }
};
const changePage = (page) => {
    forEach(pages, (el) => {
        if(el.getAttribute('id') === page) {
            el.style.display = 'flex';
        } else {
            el.style.display = 'none'; 
        }
    });
    forEach(navBtns, (el) => {
       if(el.getAttribute('nav-to') === page){
           el.style.fontWeight = 600;
       } else {
           el.style.fontWeight = 400;
       }
    });
};

forEach(navBtns, (el) => {
    el.addEventListener('click', (event) => {
         currPage = event.target.getAttribute('nav-to');
         changePage(currPage);
    });
});

