document.addEventListener('DOMContentLoaded', function() {
    
    const activeTab = document.querySelector('.nav-link.active');
    if (activeTab) {
        loadTaskData(activeTab.getAttribute('data-bs-target').replace('#', ''));
    }

    document.querySelectorAll('[data-bs-toggle="tab"]').forEach(tab => {
        tab.addEventListener('shown.bs.tab', function(event) {
            const taskId = event.target.getAttribute('data-bs-target').replace('#', '');
            loadTaskData(taskId);
        });
    });
});

function loadTaskData(taskId) {
    fetch(`/api/${taskId}`)
        .then(response => response.json())
        .then(data => {
            switch(taskId) {
                case 'task1':
                    renderTask1(data);
                    break;
                case 'task2':
                    renderTask2(data);
                    break;
                case 'task3':
                    renderTask3(data);
                    break;
                case 'task4':
                    renderTask4(data);
                    break;
                case 'task5':
                    renderTask5(data);
                    break;
                case 'task6':
                    renderTask6(data);
                    break;
                case 'task7':
                    renderTask7(data);
                    break;
                case 'task8':
                    renderTask8(data);
                    break;
                case 'task9':
                    renderTask9(data);
                    break;
            }
        })
        .catch(error => console.error('Error:', error));
}

function renderTask1(data) {

    const nodes = data.nodes.map(node => ({
        ...node,
        color: getColorForLevel(node.level)
    }));

    const edgeX = [];
    const edgeY = [];
    data.links.forEach(link => {
        const source = nodes.find(n => n.id === link.source);
        const target = nodes.find(n => n.id === link.target);
        edgeX.push(source.x, target.x, null);
        edgeY.push(source.y, target.y, null);
    });

    const diagramData = [{
        type: 'scatter',
        mode: 'markers+text',
        x: nodes.map(n => n.x),
        y: nodes.map(n => n.y),
        text: nodes.map(n => n.label),
        textposition: 'middle center',
        marker: { 
            size: 30, 
            color: nodes.map(n => n.color),
            line: { width: 2, color: 'white' }
        },
        hoverinfo: 'text',
        textfont: { size: 12, color: 'white' }
    }, {
        type: 'scatter',
        mode: 'lines',
        x: edgeX,
        y: edgeY,
        line: { width: 2, color: '#888' },
        hoverinfo: 'none'
    }];

    const layout = {
        title: 'Diagrama Conceptual del Proyecto',
        showlegend: false,
        xaxis: { 
            showgrid: false, 
            zeroline: false, 
            showticklabels: false,
            range: [-0.1, 1.2]
        },
        yaxis: { 
            showgrid: false, 
            zeroline: false, 
            showticklabels: false,
            range: [-0.1, 1.1]
        },
        margin: { t: 40, b: 20, l: 20, r: 20 },
        plot_bgcolor: 'rgba(0,0,0,0)',
        paper_bgcolor: 'rgba(0,0,0,0)'
    };

    Plotly.newPlot('task1-diagram .plotly-graph', diagramData, layout);
}

function renderTask2(data) {
    Plotly.newPlot('task2-dtypes', [{
        type: 'bar',
        x: data.dtypes.map(d => d.type),
        y: data.dtypes.map(d => d.count),
        marker: { color: '#4CA1AF' }
    }], {
        title: 'Distribución de Tipos de Datos',
        xaxis: { title: 'Tipo de dato' },
        yaxis: { title: 'Cantidad' },
        margin: { t: 40, b: 60, l: 60, r: 20 }
    });

    Plotly.newPlot('task2-nulls', [{
        type: 'bar',
        x: data.nulls.map(n => n.column),
        y: data.nulls.map(n => n.null_count),
        marker: { color: '#2C3E50' }
    }], {
        title: 'Valores Nulos por Columna',
        xaxis: { title: 'Columna' },
        yaxis: { title: 'Valores nulos' },
        margin: { t: 40, b: 120, l: 60, r: 20 }
    });

    const infoHtml = `
        <div class="col-md-4">
            <p><strong>Columnas Originales:</strong> ${data.data_info.original_columns}</p>
        </div>
        <div class="col-md-4">
            <p><strong>Columnas Finales:</strong> ${data.data_info.final_columns}</p>
        </div>
        <div class="col-md-4">
            <p><strong>Filas:</strong> ${data.data_info.rows}</p>
        </div>
    `;
    document.getElementById('task2-info').innerHTML = infoHtml;

    fetch('/api/data/head')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById('task2-data');
            tableBody.innerHTML = data.map(row => `
                <tr>
                    <td>${row.QUANTITYORDERED}</td>
                    <td>${row.PRICEEACH.toFixed(2)}</td>
                    <td>${row.SALES.toFixed(2)}</td>
                    <td>${row.MONTH_ID}</td>
                    <td>${row.YEAR_ID}</td>
                </tr>
            `).join('');
        });
}

function renderTask3(data) {

    Plotly.newPlot('task3-country', [{
        type: 'bar',
        x: data.country.map(c => c.country),
        y: data.country.map(c => c.count),
        marker: { color: '#4CA1AF' }
    }], {
        title: 'Distribución por País',
        xaxis: { title: 'País' },
        yaxis: { title: 'Conteo' },
        margin: { t: 40, b: 100, l: 60, r: 20 }
    });

    Plotly.newPlot('task3-productline', [{
        type: 'bar',
        x: data.productline.map(p => p.productline),
        y: data.productline.map(p => p.count),
        marker: { color: '#2C3E50' }
    }], {
        title: 'Distribución por Línea de Producto',
        xaxis: { title: 'Línea de Producto' },
        yaxis: { title: 'Conteo' },
        margin: { t: 40, b: 100, l: 60, r: 20 }
    });

    Plotly.newPlot('task3-dealsize', [{
        type: 'bar',
        x: data.dealsize.map(d => d.dealsize),
        y: data.dealsize.map(d => d.count),
        marker: { color: '#D4B483' }
    }], {
        title: 'Distribución por Tamaño de Trato',
        xaxis: { title: 'Tamaño de Trato' },
        yaxis: { title: 'Conteo' },
        margin: { t: 40, b: 100, l: 60, r: 20 }
    });
}

function renderTask4(data) {
    // Matriz de correlación
    const columns = data.correlation.map(c => c.index);
    const zValues = columns.map(col1 => 
        columns.map(col2 => {
            const item = data.correlation.find(c => c.index === col1);
            return item ? item[col2] : 0;
        })
    );

    Plotly.newPlot('task4-correlation', [{
        type: 'heatmap',
        x: columns,
        y: columns,
        z: zValues,
        colorscale: 'Blues',
        zmin: -1,
        zmax: 1
    }], {
        title: 'Matriz de Correlación',
        margin: { t: 40, b: 100, l: 100, r: 20 }
    });

    // Pairplot
    const dimensions = [
        { label: 'Ventas', values: data.pairplot.map(p => p.SALES) },
        { label: 'Cantidad', values: data.pairplot.map(p => p.QUANTITYORDERED) },
        { label: 'Precio Unitario', values: data.pairplot.map(p => p.PRICEEACH) },
        { label: 'MSRP', values: data.pairplot.map(p => p.MSRP) }
    ];

    Plotly.newPlot('task4-pairplot', [{
        type: 'splom',
        dimensions: dimensions,
        text: data.pairplot.map(p => `Mes: ${p.MONTH_ID}`),
        marker: {
            color: data.pairplot.map(p => p.MONTH_ID),
            colorscale: 'Viridis',
            showscale: true,
            size: 7,
            line: { width: 0.5, color: 'white' }
        }
    }], {
        title: 'Relación entre Variables',
        margin: { t: 40, b: 60, l: 60, r: 20 },
        dragmode: 'select',
        hovermode: 'closest'
    });

    // Distribución de ventas
    Plotly.newPlot('task4-sales-dist', [{
        type: 'histogram',
        x: Object.values(data.sales_dist).slice(0, -1),
        name: 'Ventas',
        marker: { color: '#4CA1AF' }
    }], {
        title: 'Distribución de Ventas',
        xaxis: { title: 'Ventas' },
        yaxis: { title: 'Frecuencia' },
        margin: { t: 40, b: 60, l: 60, r: 20 }
    });

    // Distribución de cantidad ordenada
    Plotly.newPlot('task4-qty-dist', [{
        type: 'histogram',
        x: Object.values(data.qty_dist).slice(0, -1),
        name: 'Cantidad',
        marker: { color: '#2C3E50' }
    }], {
        title: 'Distribución de Cantidad Ordenada',
        xaxis: { title: 'Cantidad' },
        yaxis: { title: 'Frecuencia' },
        margin: { t: 40, b: 60, l: 60, r: 20 }
    });
}

function renderTask5(data) {
    // Diagrama conceptual de K-Means
    const clusterColors = ['#4CA1AF', '#2C3E50', '#D4B483'];
    
    const traces = data.points.map(point => ({
        x: [point.x],
        y: [point.y],
        mode: 'markers',
        marker: {
            size: 12,
            color: clusterColors[point.cluster]
        },
        showlegend: false
    }));

    traces.push({
        x: data.centroids.map(c => c.x),
        y: data.centroids.map(c => c.y),
        mode: 'markers',
        marker: {
            size: 20,
            color: clusterColors,
            symbol: 'x',
            line: { width: 2 }
        },
        name: 'Centroides'
    });

    // Añadir líneas de conexión
    data.points.forEach(point => {
        const centroid = data.centroids[point.cluster];
        traces.push({
            x: [point.x, centroid.x],
            y: [point.y, centroid.y],
            mode: 'lines',
            line: { color: '#aaa', width: 1, dash: 'dot' },
            showlegend: false
        });
    });

    Plotly.newPlot('task5-diagram', traces, {
        title: 'Diagrama Conceptual de K-Means',
        xaxis: { showgrid: false, zeroline: false, range: [0, 7] },
        yaxis: { showgrid: false, zeroline: false, range: [1.5, 4.5] },
        margin: { t: 40, b: 40, l: 40, r: 20 }
    });

    // Llenar información descriptiva
    document.getElementById('task5-whatis').textContent = data.description.what_is;
    
    const stepsList = document.getElementById('task5-steps');
    data.description.steps.forEach(step => {
        const li = document.createElement('li');
        li.textContent = step;
        stepsList.appendChild(li);
    });

    const prosList = document.getElementById('task5-pros');
    data.description.pros.forEach(pro => {
        const li = document.createElement('li');
        li.textContent = pro;
        prosList.appendChild(li);
    });

    const consList = document.getElementById('task5-cons');
    data.description.cons.forEach(con => {
        const li = document.createElement('li');
        li.textContent = con;
        consList.appendChild(li);
    });
}

function renderTask6(data) {
    // Método del codo
    Plotly.newPlot('task6-elbow', [{
        type: 'scatter',
        mode: 'lines+markers',
        x: data.range,
        y: data.scores,
        line: { color: '#4CA1AF', width: 3 },
        marker: { size: 8, color: '#2C3E50' }
    }, {
        type: 'scatter',
        mode: 'lines',
        x: [data.optimal_k, data.optimal_k],
        y: [Math.min(...data.scores), Math.max(...data.scores)],
        line: { color: '#D4B483', width: 2, dash: 'dash' },
        name: 'K óptimo'
    }], {
        title: 'Método del Codo para Determinar K Óptimo',
        xaxis: { title: 'Número de Clusters (K)' },
        yaxis: { title: 'Inercia' },
        margin: { t: 40, b: 60, l: 60, r: 20 },
        showlegend: true,
        legend: { orientation: 'h', y: 1.1 }
    });

    document.getElementById('task6-optimal').textContent = 
        `En nuestro análisis, el codo aparece alrededor de ${data.optimal_k} clusters, lo que sugiere que este es un buen número para segmentar nuestros datos de clientes.`;
}

function renderTask7(data) {
    // Visualización de clusters 2D
    const clusterColors = ['#4CA1AF', '#2C3E50', '#D4B483', '#C1666B', '#7A9CC6'];
    
    const traces = [];
    for (let i = 0; i < 5; i++) {
        const clusterData = data.clusters.filter(c => c.cluster === i);
        traces.push({
            x: clusterData.map(d => d.x),
            y: clusterData.map(d => d.y),
            mode: 'markers',
            name: `Cluster ${i}`,
            marker: {
                size: 8,
                color: clusterColors[i]
            }
        });
    }

    // Añadir centroides
    traces.push({
        x: data.centroids.map(c => c[0]),
        y: data.centroids.map(c => c[1]),
        mode: 'markers',
        name: 'Centroides',
        marker: {
            size: 12,
            color: clusterColors.slice(0, 5),
            symbol: 'x',
            line: { width: 2 }
        }
    });

    Plotly.newPlot('task7-clusters', traces, {
        title: 'Visualización 2D de Clusters (PCA)',
        xaxis: { title: 'Componente Principal 1' },
        yaxis: { title: 'Componente Principal 2' },
        margin: { t: 40, b: 60, l: 60, r: 20 },
        legend: { orientation: 'h', y: 1.1 }
    });

    // Estadísticas por cluster
    const statsHtml = data.cluster_stats.map(stats => `
        <div class="card cluster-card">
            <div class="card-body">
                <h5 class="card-title">Cluster ${stats.cluster}</h5>
                <p class="card-text">
                    <strong>Tamaño:</strong> ${stats.size}<br>
                    <strong>Cantidad Promedio:</strong> ${stats.avg_quantity.toFixed(1)}<br>
                    <strong>Precio Promedio:</strong> $${stats.avg_price.toFixed(2)}<br>
                    <strong>Ventas Totales:</strong> $${stats.total_sales.toFixed(2)}
                </p>
            </div>
        </div>
    `).join('');

    document.getElementById('task7-stats').innerHTML = statsHtml;

    // Descripción de clusters
    const clusterDescriptions = [
        "Clientes que compran en grandes cantidades y gastan mucho",
        "Clientes que prefieren productos premium",
        "Clientes ocasionales con bajo gasto",
        "Clientes estacionales con gasto moderado",
        "Clientes regulares con gasto consistente"
    ];

    const descHtml = data.cluster_stats.map((stats, i) => `
        <div class="col-md-4 mb-3">
            <div class="card">
                <div class="card-header" style="background-color: ${clusterColors[i]}; color: white;">
                    Cluster ${stats.cluster}
                </div>
                <div class="card-body">
                    <p class="card-text">${clusterDescriptions[i]}</p>
                </div>
            </div>
        </div>
    `).join('');

    document.getElementById('task7-cluster-desc').innerHTML = descHtml;
}

function renderTask8(data) {
    // Visualización 3D
    const clusterColors = ['#4CA1AF', '#2C3E50', '#D4B483', '#C1666B', '#7A9CC6'];
    
    const traces = [];
    for (let i = 0; i < 5; i++) {
        const clusterData = data.points.filter(p => p.cluster === i);
        traces.push({
            x: clusterData.map(d => d.x),
            y: clusterData.map(d => d.y),
            z: clusterData.map(d => d.z),
            mode: 'markers',
            type: 'scatter3d',
            name: `Cluster ${i}`,
            marker: {
                size: 5,
                color: clusterColors[i],
                opacity: 0.8
            }
        });
    }

    Plotly.newPlot('task8-3d', traces, {
        title: 'Visualización 3D de Clusters (PCA)',
        margin: { t: 40, b: 40, l: 40, r: 20 },
        scene: {
            xaxis: { title: 'PC1' },
            yaxis: { title: 'PC2' },
            zaxis: { title: 'PC3' }
        }
    });

    // Varianza explicada
    Plotly.newPlot('task8-variance', [{
        type: 'scatter',
        mode: 'lines+markers',
        x: data.variance.map((v, i) => i + 1),
        y: data.variance,
        line: { color: '#4CA1AF', width: 3 },
        marker: { size: 8, color: '#2C3E50' }
    }, {
        type: 'scatter',
        mode: 'lines',
        x: [1, data.variance.length],
        y: [0.95, 0.95],
        line: { color: '#D4B483', width: 2, dash: 'dash' },
        name: '95% varianza'
    }], {
        title: 'Varianza Explicada por Componentes PCA',
        xaxis: { title: 'Número de Componentes' },
        yaxis: { title: 'Varianza Explicada Acumulada' },
        margin: { t: 40, b: 60, l: 60, r: 20 },
        showlegend: true
    });
}

function renderTask9(data) {
    // Diagrama de Autoencoder
    const nodeX = data.layers.map(layer => layer.x);
    const nodeY = data.layers.map(layer => layer.y);
    const nodeText = data.layers.map(layer => `${layer.name}\n(${layer.units})`);
    const nodeSize = data.layers.map(layer => Math.sqrt(layer.units) * 3);

    const edgeX = [];
    const edgeY = [];
    data.connections.forEach(conn => {
        const source = data.layers.find(l => l.id === conn.source);
        const target = data.layers.find(l => l.id === conn.target);
        edgeX.push(source.x, target.x, null);
        edgeY.push(source.y, target.y, null);
    });

    const diagramData = [{
        type: 'scatter',
        mode: 'markers+text',
        x: nodeX,
        y: nodeY,
        text: nodeText,
        textposition: 'middle center',
        marker: { 
            size: nodeSize, 
            color: '#4CA1AF',
            line: { width: 2, color: 'white' }
        },
        hoverinfo: 'text',
        textfont: { size: 12, color: 'white' }
    }, {
        type: 'scatter',
        mode: 'lines',
        x: edgeX,
        y: edgeY,
        line: { width: 2, color: '#888' },
        hoverinfo: 'none'
    }];

    const layout = {
        title: 'Diagrama de Autoencoder',
        showlegend: false,
        xaxis: { 
            showgrid: false, 
            zeroline: false, 
            showticklabels: false,
            range: [0, 1.2]
        },
        yaxis: { 
            showgrid: false, 
            zeroline: false, 
            showticklabels: false,
            range: [0.3, 0.7]
        },
        margin: { t: 40, b: 20, l: 20, r: 20 },
        plot_bgcolor: 'rgba(0,0,0,0)',
        paper_bgcolor: 'rgba(0,0,0,0)'
    };

    Plotly.newPlot('task9-diagram', diagramData, layout);

    // Llenar información descriptiva
    document.getElementById('task9-whatis').textContent = data.description.what_is;
    
    const componentsDiv = document.getElementById('task9-components');
    data.description.components.forEach(comp => {
        const p = document.createElement('p');
        p.innerHTML = `<strong>${comp.name}:</strong> ${comp.desc}`;
        componentsDiv.appendChild(p);
    });

    const prosList = document.getElementById('task9-pros');
    data.description.pros.forEach(pro => {
        const li = document.createElement('li');
        li.textContent = pro;
        prosList.appendChild(li);
    });

    const consList = document.getElementById('task9-cons');
    data.description.cons.forEach(con => {
        const li = document.createElement('li');
        li.textContent = con;
        consList.appendChild(li);
    });
}

function getColorForLevel(level) {
    const colors = ['#4CA1AF', '#2C3E50', '#D4B483', '#C1666B'];
    return colors[level % colors.length];
}