var renderer = null,
    scene = null,
    camera = null,
    root = null,
    group = null,
    sphere = null,
    sphereNormalMapped = null,
    duration = 10000, // ms
    currentTime = Date.now();

function animate() {

    var now = Date.now();
    var deltat = now - currentTime;
    currentTime = now;
    var fract = deltat / duration;
    var angle = Math.PI * 2 * fract;

    // Rotate the sphere group about its Y axis
    group.rotation.y += angle;
}

function run() {
    requestAnimationFrame(function () {
        run();
    });

    // Render the scene
    renderer.render(scene, camera);

    // Spin the cube for next frame
    animate();
}

var materials = {};
var mapUrl = "resources/images/atmosphere.jpg";
var map = null;
var normalMapUrl = "resources/images/earth.jpg";
var normalMap = null;

function createMaterials() {
    // Create a textre phong material for the cube
    // First, create the texture map
    map = THREE.ImageUtils.loadTexture(mapUrl);
    normalMap = THREE.ImageUtils.loadTexture(normalMapUrl);

    materials["phong"] = new THREE.MeshPhongMaterial({ map: map });
    materials["phong-normal"] = new THREE.MeshPhongMaterial({ map: map, normalMap: normalMap });
}

function setMaterialColor(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;

    materials["phong"].color.setRGB(r, g, b);
    materials["phong-normal"].color.setRGB(r, g, b);
}

function setMaterialSpecular(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;

    materials["phong"].specular.setRGB(r, g, b);
    materials["phong-normal"].specular.setRGB(r, g, b);
}

var materialName = "phong-normal";
var normalMapOn = true;
function setMaterial(name) {
    materialName = name;
    if (normalMapOn) {
        sphere.visible = false;
        sphereNormalMapped.visible = true;
        sphereNormalMapped.material = materials[name];
    }
    else {
        sphere.visible = true;
        sphereNormalMapped.visible = false;
        sphere.material = materials[name];
    }
}

function toggleNormalMap() {
    normalMapOn = !normalMapOn;
    var names = materialName.split("-");
    if (!normalMapOn) {
        setMaterial(names[0]);
    }
    else {
        setMaterial(names[0] + "-normal");
    }
}

function createScene(canvas) {

    // Create the Three.js renderer and attach it to our canvas
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });

    // Set the viewport size
    renderer.setSize(canvas.width, canvas.height);

    // Create a new Three.js scene
    scene = new THREE.Scene();

    // Add  a camera so we can view the scene
    camera = new THREE.PerspectiveCamera(45, canvas.width / canvas.height, 1, 4000);
    camera.position.z = 10;
    scene.add(camera);

    // Create a group to hold all the objects
    root = new THREE.Object3D;

    // Add a directional light to show off the object
    var light = new THREE.DirectionalLight(0xffffff, 2);

    // Position the light out from the scene, pointing at the origin
    light.position.set(.5, 0, 1);
    root.add(light);

    light = new THREE.AmbientLight(0); // 0x222222 );
    root.add(light);

    // Create a group to hold the spheres
    group = new THREE.Object3D;
    root.add(group);

    // Create all the materials
    createMaterials();

    // Create the sphere geometry
    geometry = new THREE.SphereGeometry(2, 20, 20);

    // And put the geometry and material together into a mesh
    sphere = new THREE.Mesh(geometry, materials["phong"]);
    sphere.visible = false;

    // Create the sphere geometry
    geometry = new THREE.SphereGeometry(2, 20, 20);

    // And put the geometry and material together into a mesh
    sphereNormalMapped = new THREE.Mesh(geometry, materials["phong-normal"]);
    sphereNormalMapped.visible = true;
    setMaterial("phong-normal");

    // Add the sphere mesh to our group
    group.add(sphere);
    group.add(sphereNormalMapped);

    // Now add the group to our scene
    scene.add(root);
}

function rotateScene(deltax) {
    root.rotation.y += deltax / 100;
    $("#rotation").html("rotation: 0," + root.rotation.y.toFixed(2) + ",0");
}

function scaleScene(scale) {
    root.scale.set(scale, scale, scale);
    $("#scale").html("scale: " + scale);
}

var mouseDown = false,
    pageX = 0;

function onMouseMove(evt) {
    if (!mouseDown)
        return;

    evt.preventDefault();

    var deltax = evt.pageX - pageX;
    pageX = evt.pageX;
    rotateScene(deltax);
}

function onMouseDown(evt) {
    evt.preventDefault();

    mouseDown = true;
    pageX = evt.pageX;
}

function onMouseUp(evt) {
    evt.preventDefault();

    mouseDown = false;
}

function addMouseHandler(canvas) {
    canvas.addEventListener('mousemove',
        function (e) {
            onMouseMove(e);
        }, false);
    canvas.addEventListener('mousedown',
        function (e) {
            onMouseDown(e);
        }, false);
    canvas.addEventListener('mouseup',
        function (e) {
            onMouseUp(e);
        }, false);
}

function initControls() {
    $("#slider").slider({min: 0, max: 2, value: 1, step: 0.01, animate: false});
    $("#slider").on("slide", function (e, u) {
        scaleScene(u.value);
    });


    $('#diffuseColor').ColorPicker({
        color: '#ffffff',
        onShow: function (colpkr) {
            $(colpkr).fadeIn(500);
            return false;
        },
        onHide: function (colpkr) {
            $(colpkr).fadeOut(500);
            return false;
        },
        onChange: function (hsb, hex, rgb) {
            $('#diffuseColor div').css('backgroundColor', '#' + hex);
            setMaterialColor(rgb.r, rgb.g, rgb.b);
        },
        onSubmit: function (hsb, hex, rgb, el) {
            $(el).val(hex);
            $('#diffuseColor div').css("background-color", "#" + hex);
            setMaterialColor(rgb.r, rgb.g, rgb.b);
            $(el).ColorPickerHide();
        },
    });
    var diffuseHex = "#ffffff";
    $('#diffuseColor').ColorPickerSetColor(diffuseHex);
    $('#diffuseColor div').css("background-color", diffuseHex);

    $('#specularColor').ColorPicker({
        color: '#ffffff',
        onShow: function (colpkr) {
            $(colpkr).fadeIn(500);
            return false;
        },
        onHide: function (colpkr) {
            $(colpkr).fadeOut(500);
            return false;
        },
        onChange: function (hsb, hex, rgb) {
            $('#specularColor div').css('backgroundColor', '#' + hex);
            setMaterialSpecular(rgb.r, rgb.g, rgb.b);
        },
        onSubmit: function (hsb, hex, rgb, el) {
            $(el).val(hex);
            $('#specularColor div').css("background-color", "#" + hex);
            setMaterialSpecular(rgb.r, rgb.g, rgb.b);
            $(el).ColorPickerHide();
        },
    });
    var specularHex = "#111111";
    $('#specularColor').ColorPickerSetColor(specularHex);
    $('#specularColor div').css("background-color", specularHex);

    $("#textureUrl").html(normalMapUrl);
    $("#texture").css("background-image", "url(" + normalMapUrl + ")");

    $("#textureCheckbox").click(
        function () {
            toggleNormalMap();
        }
    );

}

$(document).ready(
    function () {

        var canvas = document.getElementById("webglcanvas");

        // create the scene
        createScene(canvas);

        // add mouse handling so we can rotate the scene
        addMouseHandler(canvas);

        // initialize the controls
        initControls();

        // Run the run loop
        run();
    }
);