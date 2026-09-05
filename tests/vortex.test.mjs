import assert from 'node:assert/strict';
import test from 'node:test';
import { createRequire } from 'node:module';
const { sample } = createRequire(import.meta.url)('../versions/kinetic/vortex.js');

test('orbits stay bounded and upright for desktop and mobile over five minutes', () => {
  for (const [width,height,count] of [[1440,704,18],[390,532,12]]) {
    for (let time = 0; time <= 300; time += .5) {
      for (let i=0;i<count;i++) {
        const p=sample(i,count,time,width,height);
        assert.ok(Object.values(p).every(Number.isFinite));
        assert.ok(Math.abs(p.x)<width*.57);
        assert.ok(Math.abs(p.y)<height*.42);
        assert.ok(Math.abs(p.rotate)<13);
        assert.ok(p.scale>=.69 && p.scale<=1.14);
        assert.ok(p.shade>=0 && p.shade<.3);
      }
    }
  }
});
test('the vortex travels continuously instead of teleporting at loop boundaries', () => {
  for (let time=0;time<120;time+=.5) {
    for (let i=0;i<18;i++) {
      const a=sample(i,18,time,1440,704);
      const b=sample(i,18,time+1/60,1440,704);
      assert.ok(Math.hypot(a.x-b.x,a.y-b.y)<2);
      assert.ok(Math.abs(a.z-b.z)<1);
    }
  }
});
test('every work traverses front and back arcs, while reduced motion travels gently', () => {
  for (let i=0;i<18;i++) {
    const track=Array.from({length:60},(_,time)=>sample(i,18,time,1440,704));
    assert.ok(track.some(p=>p.z>30));
    assert.ok(track.some(p=>p.z<-30));
    let fullDistance=0, gentleDistance=0;
    for (let t=0;t<10;t+=.1) {
      const a=sample(i,18,t,1440,704), b=sample(i,18,t+.1,1440,704);
      const c=sample(i,18,t,1440,704,true), d=sample(i,18,t+.1,1440,704,true);
      fullDistance+=Math.hypot(a.x-b.x,a.y-b.y);
      gentleDistance+=Math.hypot(c.x-d.x,c.y-d.y);
    }
    assert.ok(gentleDistance>0 && gentleDistance<fullDistance*.45);
    assert.notDeepEqual(sample(i,18,0,1440,704),sample(i,18,10,1440,704));
  }
});
