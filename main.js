Fetch.then(fetchData => {
    let labels = fetchData.labels
    let data = fetchData.data
    let aktiva = data.getActive()
    let list = []
    if (!localStorage.getItem("favorites")) {
        localStorage.setItem("favorites", JSON.stringify([]))
    }
    for (let m of aktiva) {
        let container = document.getElementById("latest-matters")
        let matter = new Matter(container, m)
        list.push(matter)
    }

})

class MatterList {
    constructor(container, data) {
        this.container
        this.data = data
        this.currentData = []
        this.list = []

    }
    update() {
        this.list = []
        this.container.empty()
        for (let d of this.currentData) {
            let div = document.createElement("div")
            div.classList.add("matter-wrapper")
            let matter = new Matter(this.container, this.currentData)
            div.innerHTML = matter.template
            this.list.push(matter)
        }
    }


}

class filter {
    constructor(data) {
        this.data
        this.filter = {
            votes: { min: null, max: null },
            date: { min: null, max: null },
            onlyActive: true,
        }

    }
    parseFilter() {
        let filter = {}
        for (let x in this.filter) {
            if (typeof this.filter[x] == "object" || this.filter[x].hasOwnProperty("min")) {
                let str = ""
                let min = this.filter.min === null ? "" : ">=" + this.filter.min
                let max = this.filter.max === null ? "" : "<=" + this.filter.max
                if ((min !== null && max !== null)) {
                    str = min + ";" + max
                } else {
                    str = min !== null ? min : max
                }
                if (str) {
                    filter[x] = str
                }

            } else {

            }
        }
    }


}


class Matter {
    constructor(parent, data) {
        this.id = data.MatterId
        this.head = data.Rubrik
        this.text = data.Sammanfattning
        this.votes = Number(data["Röster"])
        this.category = data["Gäller"]
        this.img = this.category.split(/[ \/]/)[0].replace(/[^A-ö]/g, "").toLowerCase() + Math.round(Math.random() + 1).toString()
        console.log(this.img)
        this.parent = parent
        this.setHtml()
    }
    get infoStyle() {
        this.votes < 20
        let x = this.votes > 180 ? "top:0; color:black;" : this.votes < 20 ? "bottom:10%; color:black;" : "bottom:" + Math.max(0, ((this.votes / 200) * 100) + 10) + "%; color:white"
        console.log(x)
        return x
    }
    get template() {
        return `<div class="matter-img">
    <img src="/img/${this.img}.jpg" alt="" />
</div>

<div class="matter-info">
    <h2 class="matter-head">${this.head}</h2>
    <p class="matter-text">${this.text}</p>
    <div class="btn-container">
        <div class="matter-btn">Rösta</div>
        <div data-mId="${this.id}" class="fav-btn">Fav</div>
    </div>
</div>
<div class="matter-progress">
    <div class="progress-bar" style="height:${Math.min(1, this.votes / 200) * 100}%;"></div>
    <div class="info" style="${this.infoStyle}">
        <p class="votes" style="${this.infoStyle}">${this.votes}</p>
    </div>
</div>`
    }


    setHtml() {
        let div = document.createElement("div")
        div.classList.add("matter-wrapper")
        div.setAttribute("id", this.id)
        div.innerHTML = this.template
        this.parent.appendChild(div)

    }

    init() {
        if (!localStorage.getItem("favorites")) {
            localStorage.setItem("favorites", JSON.stringify([]))
        }
        let fav = document.querySelectorAll(".fav-btn")
        fav.forEach(e => {
            e.addEventListener("click", function (event) {
                let list = JSON.parse(localStorage.getItem("favorites"))
                let btn = event.target
                if (btn.classList.contains("selected")) {
                    btn.classList.remove("selected")
                    list.splice(list.indexOf(btn.getAttribute("data-mId")), 1)
                } else {
                    btn.classList.add("selected")
                    list.push(btn.getAttribute("data-mId"))
                }
                localStorage.setItem("favorites", JSON.stringify(list))
            })
        })
    }
    update() {
        let list = localStorage.getItem("favorites")

    }
}
