const content_dir = 'contents/';
const config_file = 'config.yml';

// 根据当前页面URL确定要加载的section
let section_names = [];
const pathname = window.location.pathname;

if (pathname.endsWith('index.html') || pathname === '/') {
    section_names = ['home', 'publications', 'awards'];
} else if (pathname.endsWith('risk-control.html')) {
    section_names = ['risk-control'];
} else if (pathname.endsWith('algorithm.html')) {
    section_names = ['algorithm'];
} else if (pathname.endsWith('personal-notes.html')) {
    section_names = ['personal-notes'];
}

window.addEventListener('DOMContentLoaded', event => {
    // ... 原有的滚动监听和导航栏代码保持不变 ...

    // Yaml
    fetch(content_dir + config_file)
        .then(response => response.text())
        .then(text => {
            const yml = jsyaml.load(text);
            Object.keys(yml).forEach(key => {
                try {
                    document.getElementById(key).innerHTML = yml[key];
                } catch {
                    console.log("Unknown id and value: " + key + "," + yml[key].toString());
                }
            });
        })
        .catch(error => console.log(error));

    // Marked
    marked.use({ mangle: false, headerIds: false });
    section_names.forEach((name, idx) => {
        fetch(content_dir + name + '.md')
            .then(response => response.text())
            .then(markdown => {
                const html = marked.parse(markdown);
                document.getElementById(name + '-md').innerHTML = html;
            }).then(() => {
                // MathJax
                MathJax.typeset();
            })
            .catch(error => console.log(error));
    });
});