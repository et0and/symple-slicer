/**
 *
 * @licstart
 *
 * Web Cura
 * Copyright (C) 2020 SynDaver Labs, Inc.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 * @licend
 *
 */

self.importScripts('../../three/three.min.js');
self.importScripts('../../three/OBJLoader.js');
self.importScripts('../../three/BufferGeometryUtils.js');
self.importScripts('../../util/geometry/GeometrySerialize.js');
self.importScripts('../../util/io/StlReader.js');

if(typeof TextEncoder === "undefined") {
    self.importScripts('../../FastestSmallestTextEncoderDecoder/EncoderDecoderTogether.min.js');
}

function loadFromOBJ(data) {
  var geometry = [];
  const ldr = new THREE.OBJLoader();
  const dec = new TextDecoder();
  const str = dec.decode(data);
  const obj = ldr.parse(str);
  obj.traverse( node => {
    if (node instanceof THREE.Mesh) {
      geometry.push(node.geometry);
    }
  });
  return geometry;
}

function loadFromSTL(data) {
    self.postMessage({cmd: 'progress', value: 0/4});
    var bufferGeometry = GEOMETRY_READERS.readStl(data, GEOMETRY_READERS.THREEBufferedGeometryCreator);
    self.postMessage({cmd: 'progress', value: 1/4});
    THREE.BufferGeometryUtils.mergeVertices(bufferGeometry);
    self.postMessage({cmd: 'progress', value: 2/4});
    self.postMessage({cmd: 'progress', value: 3/4});
    bufferGeometry.computeVertexNormals();
    return [bufferGeometry];
}

function send(geometry, filename) {
    geometry.forEach(
        geometry => {
            var payload = geometryToJSON(geometry);
            self.postMessage({
                cmd: 'geometry',
                geometry: payload.data,
                filename
            }, payload.tranferables);
        }
    );
}

/**
 * Event Listeners
 */

function receiveMessage(e) {
    var cmd  = e.data.cmd;
    var data = e.data;
    switch (cmd) {
        case 'loadSTL': send(loadFromSTL(data.data), data.filename); break;
        case 'loadOBJ': send(loadFromOBJ(data.data), data.filename); break;
        case 'stop': stop(); break;
        default: console.log('Unknown command: ' + cmd);
    };
}

self.addEventListener('message', receiveMessage, false);