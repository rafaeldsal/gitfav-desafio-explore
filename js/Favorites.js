import { GithubUser } from "./GithubUser.js";

// Classe referente a lógica dos dados
export class Favorite {
  constructor(root) {
    //root -> esse root é a nossa DIV #app localizada no HTML
    this.root = document.querySelector(root);
    this.load();
  }

  load() {
    this.entries = JSON.parse(localStorage.getItem("@github-favorite:")) || [];
  }

  save() {
    localStorage.setItem("@github-favorite:", JSON.stringify(this.entries));
  }

  async add(username) {
    try {
      const userExist = this.entries.find((entry) => entry.login === username);

      if (userExist) {
        throw new Error(`Usuário ${username} já cadastrado!`);
      }

      const githubUser = await GithubUser.search(username);

      if (githubUser.login === undefined) {
        throw new Error(`Usuário ${username} não encontrado!`);
      }

      this.entries = [githubUser, ...this.entries];
      this.update();
      this.save();
    } catch (error) {
      alert(error.message);
    }
  }

  delete(user) {
    const filteredEntries = this.entries.filter(
      (entry) => entry.login !== user.login
    );

    this.entries = filteredEntries;

    this.update();
    this.save();
  }
}

// Classe referente a criação de visualização e eventos HTML
export class FavoriteViews extends Favorite {
  constructor(root) {
    super(root);

    this.tbody = this.root.querySelector("table tbody");

    this.update();
    this.onadd();
  }

  onadd() {
    const addButton = this.root.querySelector(".search button");
    addButton.onclick = () => {
      const { value } = this.root.querySelector(".search input");

      this.add(value);
    };
  }

  update() {
    this.removeAllTr();

    this.entries.forEach((user) => {
      console.log(user);

      const row = this.createRow();

      row.querySelector(
        ".user img"
      ).src = `https://github.com/${user.login}.png`;
      row.querySelector(
        ".user img"
      ).alt = `Foto do perfil do GitHub de ${user.name}`;
      row.querySelector(".user a").href = `https://github.com/${user.login}`;
      row.querySelector(".user p").textContent = user.name;
      row.querySelector(".user span").textContent = `/${user.login}`;
      row.querySelector(".repositories").textContent = user.public_repos;
      row.querySelector(".followers").textContent = user.followers;

      row.querySelector(".remove").onclick = () => {
        const isOk = confirm("Tem certeza que deseja deletar essa linha?");

        if (isOk) {
          this.delete(user);
        }
      };

      this.tbody.append(row);
    });
  }

  createRow() {
    const tr = document.createElement("tr");

    tr.innerHTML = `
    <td class="user">
      <img src="https://github.com/rafaeldsal.png" alt="Foto perfil GitHub" />
      <a href="https://github.com/rafaeldsal" target="_blank">
        <p>Rafael Souza</p>
        <span>/rafaeldsal</span>
      </a>
    </td>
    <td class="repositories">1</td>
    <td class="followers">1</td>
    <td>
      <button class="remove">Remover</button>
    </td>
    `;

    return tr;
  }

  removeAllTr() {
    this.tbody.querySelectorAll("tr").forEach((elementTr) => {
      elementTr.remove();
    });
  }
}

//  Parei na aula -> Conhecendo o localStorage
