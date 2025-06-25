const cube = document.querySelector('.cube');
const cubeContainer = document.querySelector('.cube-container');
const resetButton = document.getElementById('reset-button');
const rotateFaceButton = document.getElementById('rotate-face-button');
const faceInput = document.getElementById('face-input');

//arrow for the compass at the bottom corner
const arrow = document.querySelector('.arrow-container');


let isDragging = false;
let startX, startY;
let rotationX = 0, rotationY = 0;
let zoomLevel = 2.5;

//JSON loader
// Load JSON and Configure Faces
async function loadCubeConfig() {
    const response = await fetch('cubeConfig.json');
    const config = await response.json();
    //createCubeFaces(config.AllFEB);

    const crtTH = config.AllFEB.filter(item => item.group === "Top High");
    const crtTL = config.AllFEB.filter(item => item.group === "Top Low");
    const crtE = config.AllFEB.filter(item => item.group === "East");
    const crtW = config.AllFEB.filter(item => item.group === "West");
    const crtN = config.AllFEB.filter(item => item.group === "North");
    const crtS = config.AllFEB.filter(item => item.group === "South");
    const crtB = config.AllFEB.filter(item => (item.group === "Bottom" && item.CoMy < -381.5) || item.group === "MINOS" ||  item.FEB === 82 );
    const crtBB = config.AllFEB.filter(item => item.group === "Bottom" && item.CoMy > -381.5 && item.FEB !== 82);
    

    /* createCubeFaces(crtTH);*/
    createCubeFacesRt(crtTH, '                        ', 'rotateX(90deg)'); // TextRotation & ModuleRotation
    createCubeFacesRt(crtTL, 'rotate(90deg)           ', 'rotateX(90deg)'); // TextRotation & ModuleRotation
    createCubeFacesRt(crtW,  'scaleX(-1)              ', 'rotateY(90deg)'); // TextRotation & ModuleRotation
    createCubeFacesRt(crtE,  '                        ', 'rotateY(90deg)'); // TextRotation & ModuleRotation
    createCubeFacesRt(crtN,  'scaleX(-1)              ', '               '); // TextRotation & ModuleRotation
    createCubeFacesRt(crtS,  '                        ', '               '); // TextRotation & ModuleRotation
    createCubeFacesRt(crtB,  'rotate(180deg) scaleX(-1)', 'rotateX(90deg)'); // TextRotation & ModuleRotation
    createCubeFacesRt(crtBB, 'rotate(90deg)           ', 'rotateX(90deg)'); // TextRotation & ModuleRotation
}

function createCubeFacesRt(FEBs, TextRotation, ModuleRotation) {
    FEBs.forEach(module => {
        const faceElement = document.createElement('div');
        faceElement.classList.add('module', module.FEB);
		faceElement.style.width = `${module.dimensionW}px`;
		faceElement.style.height = `${module.dimensionH}px`;

        // Add link and text
        const link = document.createElement('a');
        link.href = 'empty'; //module.linkUrl;
        link.textContent = 'F'+module.FEB;
        link.style.fontSize = '60px';
        link.style.color = 'white';

        //Modifications based on FEB group
        //Translate the top-left corner to the destinated location
        let Tx = -module.CoMx - module.dimensionW/2 ;
        let Ty = -module.CoMy - module.dimensionH/2 ;
        let Tz = -module.CoMz;

        /*
        // Radial offset for the FEBs
        // Compute the magnitude (distance from origin)
        let magnitude = Math.sqrt(Tx * Tx + Ty * Ty + Tz * Tz);

        // Avoid division by zero
        if (magnitude === 0) magnitude = 1;

        // Normalize the direction vector and scale it outward
        let radiusOffset = 60; // or any outward distance you want

        Tx = Tx + (Tx / magnitude) * radiusOffset;
        Ty = Ty + (Ty / magnitude) * radiusOffset;
        Tz = Tz + (Tz / magnitude) * radiusOffset;
        */
        
        let transformStr = `translateX(${Tx}px) translateY(${Ty}px) translateZ(${Tz}px)`;
        //X: left-->right Y: down-->up Z: s-->N
        if( TextRotation !=="") {link.style.transform = TextRotation;} 
        if( ModuleRotation !=="") {transformStr += ModuleRotation;}
		
        faceElement.style.transform = transformStr;
        //faceElement.style.backgroundColor = 'rgba(0, 0, 0, 0.65)';
        //faceElement.style.border = '2px solid red';

        cube.appendChild(faceElement);
        faceElement.appendChild(link);

		/*console.log("\nFEB: " + module.FEB);
        console.log("width: " + module.dimensionW);
        console.log("height: " + module.dimensionH);
        console.log("ymax: " + (Ty));
        console.log("transform: ", transformStr);*/
    });
}

/*function createCubeFaces(FEBs) {
    FEBs.forEach(face => {
        const faceElement = document.createElement('div');
        faceElement.classList.add('face', module.FEB);
		faceElement.style.width = `${module.dimensionW}px`;
		faceElement.style.height = `${module.dimensionH}px`;

        // Add link and text
        const link = document.createElement('a');
        link.href = 'empty'; //module.linkUrl;
        link.textContent = module.FEB;
        link.style.fontSize = '80px';
        link.style.color = 'white';

        //Modifications based on FEB group
		let transform_face = `translateX(${module.Tx}px) translateY(${-1*module.Ty}px) translateZ(${-1*module.Tz}px)`;
		if (module.group === "Top Low" ||
			module.group === "Top High" ||
			module.group === "Bottom" ||
			module.group === "MINOS" 
			) {
			transform_face += " rotateX(90deg)";
            link.style.transform = 'rotate(90deg)';
		} else if ( module.group === "East") {
			transform_face += " rotateY(90deg)";
            link.style.transform = 'scaleX(-1)';
		} else if (module.group === "West") {
			transform_face += " rotateY(90deg)";
		} else if (module.group === "North") {
            link.style.transform = 'scaleX(-1)';
		}
        faceElement.style.transform = transform_face;
        faceElement.style.backgroundColor = 'blue';


        
        cube.appendChild(faceElement);
        faceElement.appendChild(link);

		console.log(
				module.name +
				" width: " + module.dimensionW +
				" height: " + module.dimensionH +
				" transform: " + transform_face
				);
    });
}
*/

// Start dragging
document.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
});

// Dragging
document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;

    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;

    //rotationX -= deltaY * 0.5; // Adjust sensitivity with multiplier
    //rotationY += deltaX * 0.5;

    rotationX = Math.max(-90, Math.min(90, rotationX - deltaY * 0.5)); // Clamp rotationX
    rotationY += deltaX * 0.5;

	//Aids for the arrow compass
	//onCubeRotationUpdate(rotationX, rotationY);
    arrow.style.transform = `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`;

    cube.style.transform = `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`;

    startX = e.clientX;
    startY = e.clientY;
});

// Stop dragging
document.addEventListener('mouseup', () => {
    isDragging = false;
});

// Optional: Stop dragging when the mouse leaves the window
document.addEventListener('mouseleave', () => {
    isDragging = false;
});

// Reset button functionality
resetButton.addEventListener('click', () => {
    rotationX = 0;
    rotationY = 0;
    zoomLevel = 0.4;
    cube.style.transform = `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`;
    cubeContainer.style.transform = `scale(${zoomLevel})`;
});


// Zoom in/out on scroll
document.addEventListener('wheel', (e) => {
    const delta = Math.sign(e.deltaY);
    zoomLevel += delta * -0.1;
    zoomLevel = Math.min(Math.max(zoomLevel, 0.05), 2); // Clamp zoom level between 0.05 and 2
    cubeContainer.style.transform = `scale(${zoomLevel})`;
});


// Rotate to specific face functionality
/*
rotateFaceButton.addEventListener('click', () => {
    const faceName = faceInput.value.toLowerCase().trim();

    // Ensure the face name matches one of the FEBs
    const validFaces = ['front', 'back', 'left', 'right', 'top', 'bottom', 'parallel-top'];

    if (validFaces.includes(faceName)) {
        // Reset cube transform and move the specific face to the front
        cube.style.transform = `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`;

        // Calculate rotation values to bring the selected face to the front
        let rotateX = 0;
        let rotateY = 0;

        switch (faceName) {
            case 'front':
                rotateX = 0;
                rotateY = 0;
                break;
            case 'back':
                rotateX = 0;
                rotateY = 180;
                break;
            case 'left':
                rotateX = 0;
                rotateY = -90;
                break;
            case 'right':
                rotateX = 0;
                rotateY = 90;
                break;
            case 'top':
                rotateX = 90;
                rotateY = 0;
                break;
            case 'bottom':
                rotateX = -90;
                rotateY = 0;
                break;
            case 'parallel-top':
                rotateX = 90;
                rotateY = 180;
                break;
        }

        cube.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    } else {
        alert('Invalid face name! Please enter one of: front, back, left, right, top, bottom, parallel-top.');
    }
});
*/

// Load the cube configuration when the page loads
loadCubeConfig();
