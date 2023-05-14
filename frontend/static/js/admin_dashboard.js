const dropdowns = document.getElementsByClassName('dropdown')
for (let i = 0; i < dropdowns.length; i++) {
    const btn = dropdowns[i];
    const image = document.getElementById(`progress-image-${btn.id}`)
    // console.log(image);
    image.style.display='none'
    btn.addEventListener('click',()=>{
        // console.log(image.style.display);
        if (image.style.display==='none') {
            image.style.display='block'
        }else{
            image.style.display='none';
        }
    })
    const close_btn = document.getElementById(`close-btn-${btn.id}`)
    close_btn.addEventListener("click", () => {
        image.style.display = 'none';
    })
}