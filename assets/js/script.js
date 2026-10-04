// ---------------------------------------- //
// YOUR NAME SCRIPT
// ---------------------------------------- //


// ---------------------------------------- //
// PREVENT LOOKING INTO
// ---------------------------------------- //
// 1. right-click
  document.addEventListener('contextmenu', e => e.preventDefault());

  // 2. shortcut
  document.addEventListener('keydown', e => {
    if (
      e.key === 'F12' ||
      (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key.toUpperCase())) ||
      (e.ctrlKey && e.key.toLowerCase() === 'u')
    ) {
      e.preventDefault();
    }
  });

  // 3. debugger
  setInterval(() => {
    (function () { return false; }).constructor('debugger')();
  }, 100);



// DATA IMPORT
const origin = ['Chinese', 'Japanese', 'Korean'];
const oops = -19.42562238271884;

let LH = null;
async function loadData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("No file found");
    }
    const base64String = await response.text();
    const decodedText = window.atob(base64String.trim());
    LH = JSON.parse(decodedText);
    console.log('DATA LOADING SUCCESSFUL:');

  } catch (error) {
    console.error('DATA LOADING FAILED:', error);
  }
}

const dataPath = 'assets/data/train.txt'
loadData(dataPath)

// ---------------------------------------- //
// INITIAL LOADING
document.addEventListener('DOMContentLoaded', () => {
  const text = document.querySelector('input[type="text"]');
  if (text) {
    text.disabled = false;
  }
});

// ---------------------------------------- //
// BUTTON
const submitBtn = document.getElementById("submitBtn");
const againBtn = document.getElementById("againBtn");
const enteredName = document.getElementById("enteredName");
const checkBtn = document.getElementsByClassName("check");

// ENABLING 'SUBMIT' BUTTON
enteredName.addEventListener("input", function () {
  const name = enteredName.value;
  const long = (name.replace(/\s/g, "").length > 4);
  const engl = /^[A-Za-z ]+$/.test(name);

  if (long) {
    document.getElementById("len").style.color = '#3CB371';
  } else {
    document.getElementById("len").style.color = '#FF0000';
  }

  if (engl) {
    document.getElementById("eng").style.color = '#3CB371';
  } else {
    document.getElementById("eng").style.color = '#FF0000';
  }

  if (long & engl) {
    submitBtn.disabled = false;
  } else {
    submitBtn.disabled = true;
  }
});

function predict() {
  let name = enteredName.value.toLowerCase().replace(/\s+/g, ' ').replace(/[^A-Za-z ]/g, '');
  name = '_' + name.trim().replace(/\s+/, '_') + '_';

  let [pc, pj, pk] = [0, 0, 0]
  for (let i = 0; i < name.length - 1; i++) {
    each = name[i] + name[i + 1]
    pc += (LH['CN'][each] || oops)
    pj += (LH['JP'][each] || oops)
    pk += (LH['KR'][each] || oops)
  }
  const one = [Math.exp(pc), Math.exp(pj), Math.exp(pk)];
  const sum = one.reduce((acc, current) => acc + current, 0);
  const idx = one.reduce((iMax, x, i, arr) => x > arr[iMax] ? i : iMax, 0);

  document.getElementById("msg").innerHTML = 'Sounds like a <b>' + origin[idx] + '</b> name.'
  return [origin[idx], one[idx] / sum]
}

// ---------------------------------------- //
// SUBMIT BUTTON OPERATION
let pred, prob;
submitBtn.addEventListener("click", function () {
  [pred, prob] = predict()
  enteredName.disabled = true;
  submitBtn.disabled = true;
  againBtn.disabled = false;

  document.getElementById("len").style.color = '';
  document.getElementById("eng").style.color = '';
});

// ---------------------------------------- //
// RESTART BUTTON OPERATION
againBtn.addEventListener("click", function () {
  // Disable while processing
  enteredName.disabled = false;
  againBtn.disabled = true;
  document.getElementById("msg").innerHTML = '';

});

// ---------------------------------------- //
// POST INFORMATION
// ---------------------------------------- //

// GOOGLE URL
// const GOOGLE = "https://script.google.com/macros/s/AKfycbyVFuYRlv95nnaW6iu24lN6fkj-05lY16AesW4u55Dr-WqyWCBlRBvKpxP8XTgZmHUB/exec";

// // DEFINE sendData()
// async function sendData() {
//   const nameValue = enteredName.value.trim();


//   try {
//     const response = await fetch(GOOGLE, {
//       method: "POST",
//       headers: {
//         "Content-Type": "text/plain;charset=utf-8",
//       },
//       body: JSON.stringify({ name: nameValue, pred: pred, prob: prob })
//     });

//     const result = await response.json();

//     if (result.result === "success") {
//       enteredName.value = '';
//     }

//   } catch (error) {
//     console.error("Error:", error);

//   } finally {
//     enteredName.disabled = false;
//     againBtn.innerText = "RESTART";
//   }
// }


// ---------------------------------------- //
// EXTRACTING USER INFO
// ---------------------------------------- //
// let userInfo = null;

// async function loadIpData() {
//   try {
//     const res = await fetch('https://ipapi.co/json/'); // IPv4 전용 권장
//     const data = await res.json();

//     // 외부 변수에 데이터 할당
//     // visitor = data;
//     userInfo = {
//       IPv6: data.ip,
//       country: data.country_name,
//       city: data.city,
//       screen: `${screen.width}x${screen.height}`,
//       viewport: `${window.innerWidth}x${window.innerHeight}`,
//       userAgent: navigator.userAgent,
//       language: navigator.language
//     };
//   } catch (err) {
//     console.error("오류 발생:", err);
//   }
// }

// loadIpData();