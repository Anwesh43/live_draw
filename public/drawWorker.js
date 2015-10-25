function update() {
    postMessage(10);
    setTimeout("update()",100);
}
update();
