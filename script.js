(() => {
  "use strict";
  const $ = (selector) => document.querySelector(selector);
  const typedMessage = $("#typedMessage");
  const cursor = $("#cursor");
  const music = $("#music");
  const musicBtn = $("#musicBtn");
  const musicLabel = $("#musicLabel");
  const musicFile = $("#musicFile");
  const toast = $("#toast");
  const revealPanel = $("#revealPanel");
  const revealTitle = $("#revealTitle");
  const revealText = $("#revealText");
  const revealLabel = $("#revealLabel");
  const nextChapter = $("#nextChapter");

  const letter = "يمكن مش محتاجين مناسبة عشان أقولك إنتِ غالية عندي قد إيه، بس ساعات الكلام اللي جوانا بيستاهل ياخد مساحة لوحده.\\n\\nيا هنهونتيييي، وجودك في حياتي بيخلّي التفاصيل الصغيرة مختلفة؛ رسالة منك، ضحكة، أو حتى لحظة عادية وإنتِ فيها. بحب طريقتك، وروحك، والحاجات اللي بتخلّيكي إنتِ ومحدش غيرك.\\n\\nمش بوعدك إن كل يوم هيبقى مثالي، لكن بوعدك إني أقدّر وجودك، وأسمعك، وأفتكر دايمًا إن اللي بينا حاجة تستاهل الاهتمام.\\n\\nدي مش رسالة لمناسبة… دي رسالة عشان إنتِ في بالي، ولأن قلبي حب يفكّرك بده النهارده. ❤️";
  let typingTimer = null;
  let chapterOpened = -1;
  let toastTimer = null;
  const chapters = [
    { title: "أول الحكاية", text: "أكتر حاجة مميزة فيكي إنك بقيتي قريبة من قلبي بطريقة هادية وحقيقية. مش محتاجة تعملي حاجة كبيرة عشان تفرّحيني… ساعات مجرد إنك موجودة كفاية. ومع الوقت بقيت أحب تفاصيلك الصغيرة قبل الكبيرة." },
    { title: "حاجات بحبها فيكي", text: "بحب ضحكتك لما تطلع من قلبك، وطريقتك وإنتِ بتحكي، واهتمامك بالتفاصيل اللي غيرك ممكن يعدّيها. بحب إن ليكي طريقتك الخاصة اللي بتخلّيكي مختلفة، وبحب حتى الحاجات البسيطة اللي يمكن إنتِ مش واخدة بالك إنها بتفرّحني." },
    { title: "وعد صغير", text: "وعدي ليكي إني ماخليش الكلام الحلو يبقى كلام وبس. هحاول أفضل صريح معاكي، أسمعك وقت ما تحتاجي، وأفرح لفرحتك، ونحل أي حاجة سوا بهدوء واحترام. مش وعد بالكمال… وعد إني أفضل مهتم." }
  ];

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
  }

  function typeLetter() {
    clearInterval(typingTimer);
    typedMessage.textContent = "";
    cursor.hidden = false;
    let index = 0;
    typingTimer = setInterval(() => {
      typedMessage.textContent += letter.charAt(index);
      index++;
      if (index >= letter.length) {
        clearInterval(typingTimer);
        cursor.hidden = true;
      }
    }, 32);
  }

  $("#beginBtn").addEventListener("click", () => {
    $("#letter").scrollIntoView({ behavior: "smooth" });
    typeLetter();
    makeHearts(12);
  });
  $("#replayLetter").addEventListener("click", typeLetter);

  function openChapter(index) {
    chapterOpened = Math.max(chapterOpened, index);
    const chapter = chapters[index];
    revealLabel.textContent = `فصل 0${index + 1} / من حكايتنا`;
    revealTitle.textContent = chapter.title;
    revealText.textContent = chapter.text;
    revealPanel.hidden = false;
    revealPanel.scrollIntoView({ behavior: "smooth", block: "center" });
    makeHearts(8);
    document.querySelectorAll(".chapter-card").forEach((card, i) => {
      if (i <= chapterOpened) {
        card.classList.remove("locked");
        card.classList.add("unlocked");
        card.disabled = false;
        card.querySelector(".chapter-action").textContent = i < chapterOpened ? "افتحي الفصل تاني ↗" : "الفصل مفتوح ♡";
      }
    });
    nextChapter.hidden = index >= chapters.length - 1;
    if (index === chapters.length - 1) showToast("وصلتي لآخر فصل… بس حكايتنا مكملة ❤️");
  }

  document.querySelectorAll(".chapter-card").forEach((card) => {
    card.addEventListener("click", () => {
      const index = Number(card.dataset.chapter);
      if (index > chapterOpened + 1) {
        showToast("افتحي الفصول بالترتيب يا هنهونتي ❤️");
        return;
      }
      openChapter(index);
    });
  });
  nextChapter.addEventListener("click", () => {
    const next = chapterOpened + 1;
    if (next < chapters.length) openChapter(next);
  });

  $("#surpriseBtn").addEventListener("click", () => {
    const surprise = $("#finalSurprise");
    surprise.hidden = !surprise.hidden;
    $("#surpriseBtn span:first-child").textContent = surprise.hidden ? "آخر مفاجأة ليكي" : "خبّي المفاجأة";
    if (!surprise.hidden) {
      surprise.scrollIntoView({ behavior: "smooth", block: "center" });
      makeHearts(22);
    }
  });

  async function toggleMusic() {
    if (music.paused) {
      try {
        await music.play();
        musicBtn.classList.add("playing");
        musicLabel.textContent = "وقّفي الموسيقى";
      } catch (error) {
        musicFile.click();
        showToast("اختاري أغنية من جهازك عشان نسمعها سوا 🎵");
      }
    } else {
      music.pause();
      musicBtn.classList.remove("playing");
      musicLabel.textContent = "شغّلي موسيقانا";
    }
  }
  musicBtn.addEventListener("click", toggleMusic);
  music.addEventListener("error", () => {
    musicBtn.classList.remove("playing");
    musicLabel.textContent = "اختاري أغنيتنا";
  });
  musicFile.addEventListener("change", () => {
    const file = musicFile.files && musicFile.files[0];
    if (!file) return;
    if (music.dataset.objectUrl) URL.revokeObjectURL(music.dataset.objectUrl);
    const objectUrl = URL.createObjectURL(file);
    music.dataset.objectUrl = objectUrl;
    music.src = objectUrl;
    music.play().then(() => {
      musicBtn.classList.add("playing");
      musicLabel.textContent = "وقّفي الموسيقى";
      showToast("الموسيقى اشتغلت ❤️");
    }).catch(() => showToast("مش قادر أشغّل الملف ده، جرّبي ملف صوت تاني."));
  });
  music.addEventListener("ended", () => {
    musicBtn.classList.remove("playing");
    musicLabel.textContent = "شغّلي موسيقانا";
  });

  const particleHost = $("#particles");
  function makeHearts(count = 5) {
    for (let i = 0; i < count; i++) {
      const particle = document.createElement("span");
      particle.className = "particle";
      particle.textContent = Math.random() > .45 ? "♥" : "✦";
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.fontSize = `${10 + Math.random() * 16}px`;
      particle.style.animationDuration = `${5 + Math.random() * 6}s`;
      particle.style.animationDelay = `${Math.random() * .8}s`;
      particleHost.appendChild(particle);
      setTimeout(() => particle.remove(), 12500);
    }
  }
  setInterval(() => makeHearts(2), 1800);
  $("#home").addEventListener("pointerdown", (event) => {
    if (event.target.closest("button")) return;
    const heart = document.createElement("span");
    heart.className = "particle";
    heart.textContent = "♡";
    heart.style.left = `${Math.min(95, Math.max(3, (event.clientX / window.innerWidth) * 100))}%`;
    heart.style.fontSize = "22px";
    heart.style.animationDuration = "4s";
    particleHost.appendChild(heart);
    setTimeout(() => heart.remove(), 4500);
  });
  cursor.hidden = true;
})();