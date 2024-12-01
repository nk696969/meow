// シーン、カメラ、レンダラーの設定
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// トーラスジオメトリとマテリアルの作成
const geometry = new THREE.TorusGeometry(5, 1.5, 16, 100);
const material = new THREE.PointsMaterial({ size: 0.1, vertexColors: true });
const points = new THREE.Points(geometry, material);
scene.add(points);

// 頂点ごとの色の設定
const colors = [];
const color = new THREE.Color();
for (let i = 0; i < geometry.attributes.position.count; i++) {
    color.setHSL((i / geometry.attributes.position.count), 1, 0.5);
    colors.push(color.r, color.g, color.b);
}
geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

// カメラの位置設定
camera.position.z = 20; // サイズに合わせて調整

// アニメーションループ
function animate() {
    requestAnimationFrame(animate);

    // トーラスの回転
    points.rotation.x += 0.01;
    points.rotation.y += 0.01;

    // 色相を徐々に変化させる速度を落とす
    const time = Date.now() * 0.0005;
    const h = (time % 1);
    for (let i = 0; i < geometry.attributes.color.count; i++) {
        color.setHSL((h + i / geometry.attributes.position.count) % 1, 1, 0.5); // 波のように変化
        geometry.attributes.color.setXYZ(i, color.r, color.g, color.b);
    }
    geometry.attributes.color.needsUpdate = true;

    renderer.render(scene, camera);
}

// リサイズ対応
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

animate();
