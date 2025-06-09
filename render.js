/* render.js */
document.addEventListener("DOMContentLoaded", async () => {
  const page = window.location.pathname.split("/").pop().replace(".html", "");
  const profileName = page === "" || page === "index" ? "devops" : page;

  const [cv, profile] = await Promise.all([
    fetch("cv.json").then((r) => r.json()),
    fetch(`profiles/${profileName}.json`).then((r) => r.json()),
  ]);

  // Titre du CV
  document.getElementById("cv-title").textContent = profile.title;

  // Coordonnées
  const contact = cv.personal.contact;
  document.getElementById("contact-info").innerHTML = `
    <span>${contact.phone}</span>
    <span>${contact.email}</span>
    <a href="${contact.github}" class="text-blue-500" target="_blank">GitHub</a>
    <a href="${contact.linkedin}" class="text-blue-500" target="_blank">LinkedIn</a>
  `;

  // Présentation
  document.getElementById("summary").textContent = cv.personal.summary;

  // Fonction de rendu section
  const section = (title, items) => {
    const div = document.createElement("div");
    div.innerHTML = `
      <h2 class='text-xl font-semibold mb-2 text-center'>${title}</h2>
      <ul class='space-y-1'>
        ${items
          .map((i) => {
            const label = i.label || i.name || i.role || "Sans titre";
            const desc = i.description || i.stack || "";
            return `<li><strong>${label}</strong>${
              desc ? " – " + desc : ""
            }</li>`;
          })
          .join("")}
      </ul>
    `;
    return div;
  };

  const sections = document.getElementById("cv-sections");

  const wrapInBox = (contentNode) => {
    const title = contentNode.querySelector("h2");
    if (title) {
      // Create main container
      const container = document.createElement("div");
      container.className = "mb-6";

      // Create title container with background
      const titleContainer = document.createElement("div");
      titleContainer.className = "bg-[#fdf6ec] py-4 mb-4";

      // Create title wrapper for centering
      const titleWrapper = document.createElement("div");
      titleWrapper.className = "text-center";

      // Style the title
      title.className = "text-xl font-semibold inline-block";

      // Build the DOM structure
      titleWrapper.appendChild(title);
      titleContainer.appendChild(titleWrapper);
      container.appendChild(titleContainer);

      // Move remaining content
      while (contentNode.firstChild) {
        container.appendChild(contentNode.firstChild);
      }

      // Clear and update the original content
      contentNode.innerHTML = "";
      contentNode.appendChild(container);
    }
    return contentNode;
  };

  // Section Compétences techniques (fixe)
  const staticSkills = document.createElement("div");
  staticSkills.innerHTML = `
    <h2 class='text-xl font-semibold mb-2 text-center'>Compétences techniques</h2>
    <ul class='space-y-1 text-sm'>
      <li><strong>Langages pratiqués :</strong> C, C++, JavaScript (Node.js), TypeScript, SQL (MySQL/MariaDB), Bash</li>
      <li><strong>Langages étudiés :</strong> Python (autoformation IA), Java (CNAM)</li>
      <li><strong>Outils & environnements :</strong> Linux, Docker, docker-compose, Git, GitHub, Vim, VS Code, Notion, Figma</li>
    </ul>
  `;
  sections.appendChild(wrapInBox(staticSkills));

  // Section Formation
  const formationSection = document.createElement("div");
  formationSection.innerHTML = `
    <h2 class='text-xl font-semibold mb-2 text-center'>Formation</h2>
    <p class='text-sm'><strong>École 42 Paris – Depuis 2023</strong><br>
    Formation en informatique intensive : apprentissage par projet, autonomie, peer-learning, résolution de problèmes, collaboration, évaluation par les pairs, adaptabilité.</p>
    <p class='mt-2 mb-1 text-sm font-medium'>Exemples de projets réalisés à 42 :</p>
    <ul class='space-y-1 text-sm'>
      ${cv.projects
        .filter(
          (i) =>
            profile.include.projects &&
            profile.include.projects.includes(i.id)
        )
        .map(
          (i) =>
            `<li><strong>${i.name}</strong>${
              i.description ? " – " + i.description : ""
            }</li>`
        )
        .join("")}
    </ul>
  `;
  formationSection.innerHTML += `
    <p class='mt-4 mb-1 text-sm font-medium'>Autres formations</p>
    <ul class='space-y-1 text-sm'>
      <li><strong>CNAM Paris (2013–2016)</strong> – Java, Web, bases de données</li>
      <li><strong>DMA Design Métal – ENSAAMA (1995–1998)</strong> – Arts appliqués</li>
      <li><strong>Conservatoires Noisiel & Bobigny (2014–2022)</strong> – Formation musicale, contrebasse & jazz</li>
      <li><strong>Baccalauréat D – 1994</strong> – Maths/sciences</li>
    </ul>
  `;
  sections.appendChild(wrapInBox(formationSection));

  if (profile.include.experiences) {
    const items = cv.experiences.filter((i) =>
      profile.include.experiences.includes(i.id)
    );
    sections.appendChild(
      wrapInBox(section("Expériences professionnelles", items))
    );
  }
});
