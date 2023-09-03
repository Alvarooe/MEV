// CHART START
// 1. aquí hay que poner el código que genera la gráfica
const width = 800
const height = 600
const margin = {
    top: 10,
    right: 10,
    bottom: 40,
    left: 60,
}

const svg = d3.select("div#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height)

const elementGroup = svg.append("g")
    .attr("class", "elementGroup")
    .attr("transform", `translate(${margin.left}, ${margin.top})`)
const axis = svg.append("g").attr("class", "axis")

const xAxisGroup = axis.append("g").attr("class", "xAxisGroup")
    .attr("transform", `translate(${margin.left}, ${height - margin.bottom})`)
const yAxisGroup = axis.append("g").attr("class", "yAxisGroup")
    .attr("transform", `translate(${margin.left}, ${margin.top})`)

const x = d3.scaleLinear().range([0, width - margin.left - margin.right])
const y = d3.scaleBand().range([0, height - margin.top - margin.bottom])
    .padding(0.1)

const xAxis = d3.axisBottom().scale(x)
const yAxis = d3.axisLeft().scale(y)

let years;
let winners;
let originalData;

let data;
let data1;
let anio1;

// data:
//d3.csv("WorldCup.csv").then(data => {
d3.csv("WorldCup.csv").then(data => {
    // 2. aquí hay que poner el código que requiere datos para generar la gráfica
    data.map(d => {
        d.anio = +d.Year
    })

    //years = [d3.min(data.map(d => d.anio)), d3.max(data.map(d => d.anio))]
    years = (data.map(d => d.anio))
    //data0 = data;
    //console.log(years)

    //console.log(data)

    filterDataByYear(data, '2022')

    //console.log(data)

    nest = d3.nest()
        .key(d => d.Winner)
        .entries(data)

    nest.map(d => {
        d.country = d.key,
        d.titles = d.values.length
    })

    //console.log(nest)

    x.domain([0, d3.max(nest.map(d => d.titles))])
    y.domain(nest.map(d => d.country))

    xAxis.ticks(d3.max(nest.map (d => d.titles)))

    xAxisGroup.call(xAxis)
    yAxisGroup.call(yAxis)

    // update:
    //update(winners)
    //console.log(d3.max(years))
    slider()

    filterDataByYear(data, '1982')

    //console.log(data1)

    nest1 = d3.nest()
        .key(d => d.Winner)
        .entries(data1)

    nest1.map(d => {
        d.country = d.key,
        d.titles = d.values.length
    })

    //console.log(nest1)



    const elements = elementGroup.selectAll("rect").data(nest1)

    elements.enter()
        .append("rect")
        .attr("class", d => `${d.country} + bar`)
        .attr("x", 0)
        .attr("y", d => y(d.country))
        .attr("width", d => x(d.titles))
        .attr("height", y.bandwidth())



})


// update:
//function update(data) {
function update() {
    // 3. función que actualiza el gráfico
    nest1 = d3.nest()
        .key(d => d.Winner)
        .entries(data1)

    nest1.map(d => {
        d.country = d.key,
        d.titles = d.values.length
    })

    console.log(nest1)

    const elements = elementGroup.selectAll("rect").data(nest1)

    elements.enter()
        .append("rect")
        .attr("class", d => `${d.country} + bar`)
        .attr("x", 0)
        .attr("y", d => y(d.country))
        .transition()
        .duration(1000)
        .attr("width", d => x(d.titles))
        .attr("height", y.bandwidth())

    elements
        //.attr("x", 0)
        //.attr("y", d => y(d.country))
        .transition()
        .duration(1000)
        .attr("width", d => x(d.titles))
        //.attr("height", y.bandwidth())


    elements.exit()
        .transition()
        .duration(1000)
        .attr("width", 0)
        .remove()
}

// treat data:
function filterDataByYear(data, year) { 
    // 4. función que filtra los datos dependiendo del año que le pasemos (year)
    
    console.log(year)
    data1 = data.filter(d => d.anio <= year)
    console.log(year)
}


// CHART END

// slider:
function slider() {    
    // esta función genera un slider:

    var sliderTime = d3
        .sliderBottom()
        .min(d3.min(years))  // rango años
        .max(d3.max(years))
        .step(4)  // cada cuánto aumenta el slider (4 años)
        .width(580)  // ancho de nuestro slider en px
        .ticks(years.length - 1)  
        .default(years[years.length -1])  // punto inicio del marcador
        .on('onchange', val => {
            // 5. AQUÍ SÓLO HAY QUE CAMBIAR ESTO:
            //console.log("La función aún no está conectada con la gráfica")
            d3.select('p#value-time').text(sliderTime.value());
            //console.log(sliderTime.value());
            anio1 = sliderTime.value();

            //filterDataByYear(data, anio1);

            console.log("Oks");
            d3.csv("WorldCup.csv").then(data => {
                // 2. aquí hay que poner el código que requiere datos para generar la gráfica
                console.log("Oks");
                data.map(d => {
                    d.anio = +d.Year
                })

                filterDataByYear(data, anio1);
                update();

            })

            // hay que filtrar los datos según el valor que marquemos en el slider y luego actualizar la gráfica con update
        });

        // contenedor del slider
        var gTime = d3 
            .select('div#slider-time')  // div donde lo insertamos
            .append('svg')
            .attr('width', width * 0.8)
            .attr('height', 100)
            .append('g')
            .attr('transform', 'translate(30,30)');

        gTime.call(sliderTime);  // invocamos el slider en el contenedor

        d3.select('p#value-time').text(sliderTime.value());  // actualiza el año que se representa
}