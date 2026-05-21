const campaigns = [
  {
    name: "Retention Squad",
    copy: "Priority queue for high-value customers with renewal risk.",
    ticker: "AI routing is balancing tech support overflow to the remote backup pod.",
  },
  {
    name: "Summer Sales Blitz",
    copy: "Outbound conversion push for new broadband and mobile bundles.",
    ticker: "Lead scoring has moved premium prospects to the top of the callback queue.",
  },
  {
    name: "VIP Escalations",
    copy: "Fast-lane support for enterprise accounts and churn prevention.",
    ticker: "Supervisor assist is active on complex escalations with high revenue impact.",
  },
];

const agents = [
  { name: "Marta", skill: "Billing specialist", state: "In call" },
  { name: "Diego", skill: "Sales closer", state: "Wrap-up" },
  { name: "Lucia", skill: "Technical support", state: "In call" },
  { name: "Pablo", skill: "Retention desk", state: "Break" },
  { name: "Nora", skill: "QA coach", state: "In call" },
  { name: "Irene", skill: "Escalation pod", state: "Wrap-up" },
];

const activityTemplates = [
  "Callback request converted into a live sale with upsell accepted.",
  "Overflow queue moved 6 calls to remote agents in under 15 seconds.",
  "Supervisor joined a sensitive escalation and restored SLA buffer.",
  "Billing dispute resolved on first contact with positive CSAT note.",
  "Knowledge base prompt reduced average handle time for technical issues.",
  "Predictive dialer paused low-intent leads and boosted agent occupancy.",
];

const state = {
  live: true,
  campaignIndex: 0,
  queue: 18,
  agentsOnline: 42,
  wrapUp: 6,
  sla: 89,
  callsHandled: 1284,
  averageScore: 91,
  risk: "Low",
  mix: {
    billing: 31,
    sales: 27,
    tech: 42,
  },
};

const elements = {
  campaignName: document.querySelector("#campaign-name"),
  campaignCopy: document.querySelector("#campaign-copy"),
  callsHandled: document.querySelector("#calls-handled"),
  averageScore: document.querySelector("#average-score"),
  queueSize: document.querySelector("#queue-size"),
  queueTrend: document.querySelector("#queue-trend"),
  agentsOnline: document.querySelector("#agents-online"),
  agentTrend: document.querySelector("#agent-trend"),
  slaScore: document.querySelector("#sla-score"),
  slaTrend: document.querySelector("#sla-trend"),
  riskScore: document.querySelector("#risk-score"),
  riskTrend: document.querySelector("#risk-trend"),
  billingValue: document.querySelector("#billing-value"),
  salesValue: document.querySelector("#sales-value"),
  techValue: document.querySelector("#tech-value"),
  billingBar: document.querySelector("#billing-bar"),
  salesBar: document.querySelector("#sales-bar"),
  techBar: document.querySelector("#tech-bar"),
  tickerCopy: document.querySelector("#ticker-copy"),
  agentList: document.querySelector("#agent-list"),
  activityFeed: document.querySelector("#activity-feed"),
  toggleLive: document.querySelector("#toggle-live"),
  rotateCampaign: document.querySelector("#rotate-campaign"),
  liveIndicator: document.querySelector("#live-indicator"),
};

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function formatNumber(value) {
  return new Intl.NumberFormat("en-US").format(value);
}

function riskFromQueue(queue, sla) {
  if (queue > 25 || sla < 80) return "High";
  if (queue > 16 || sla < 87) return "Medium";
  return "Low";
}

function trendClass(value) {
  if (value < 0) return "positive";
  if (value > 3) return "negative";
  return "";
}

function renderAgents() {
  elements.agentList.innerHTML = "";
  agents.forEach((agent) => {
    const initials = agent.name.slice(0, 2).toUpperCase();
    const stateClass = agent.state.toLowerCase().replace(/\s+/g, "-");
    const item = document.createElement("article");
    item.className = "agent-card";
    item.innerHTML = `
      <div class="agent-avatar">${initials}</div>
      <div class="agent-meta">
        <strong>${agent.name}</strong>
        <span>${agent.skill}</span>
      </div>
      <span class="agent-state ${stateClass}">${agent.state}</span>
    `;
    elements.agentList.appendChild(item);
  });
}

function addActivity(message) {
  const item = document.createElement("li");
  const now = new Date();
  const time = now.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
  item.innerHTML = `
    <span class="activity-time">${time}</span>
    <span class="activity-copy">${message}</span>
  `;
  elements.activityFeed.prepend(item);
  if (elements.activityFeed.children.length > 6) {
    elements.activityFeed.lastElementChild.remove();
  }
}

function renderDashboard() {
  const campaign = campaigns[state.campaignIndex];
  elements.campaignName.textContent = campaign.name;
  elements.campaignCopy.textContent = campaign.copy;
  elements.callsHandled.textContent = formatNumber(state.callsHandled);
  elements.averageScore.textContent = `${state.averageScore}%`;
  elements.queueSize.textContent = `${state.queue}`;

  const minuteDelta = randomInt(-3, 5);
  elements.queueTrend.textContent = `${
    minuteDelta >= 0 ? "+" : ""
  }${minuteDelta} in the last minute`;
  elements.queueTrend.className = `metric-trend ${trendClass(minuteDelta)}`.trim();

  elements.agentsOnline.textContent = `${state.agentsOnline}`;
  elements.agentTrend.textContent = `${state.wrapUp} on wrap-up`;
  elements.slaScore.textContent = `${state.sla}%`;
  elements.slaTrend.textContent =
    state.sla >= 88 ? "Above target" : "Needs attention";
  elements.slaTrend.className = `metric-trend ${
    state.sla >= 88 ? "positive" : "negative"
  }`;

  state.risk = riskFromQueue(state.queue, state.sla);
  elements.riskScore.textContent = state.risk;
  elements.riskTrend.textContent =
    state.risk === "Low"
      ? "Stable pacing"
      : state.risk === "Medium"
        ? "Watch callbacks"
        : "Escalate staffing";
  elements.riskTrend.className = `metric-trend ${
    state.risk === "Low" ? "positive" : state.risk === "Medium" ? "" : "negative"
  }`;

  elements.billingValue.textContent = `${state.mix.billing}%`;
  elements.salesValue.textContent = `${state.mix.sales}%`;
  elements.techValue.textContent = `${state.mix.tech}%`;
  elements.billingBar.style.width = `${state.mix.billing}%`;
  elements.salesBar.style.width = `${state.mix.sales}%`;
  elements.techBar.style.width = `${state.mix.tech}%`;
  elements.tickerCopy.textContent = campaign.ticker;

  elements.liveIndicator.textContent = state.live ? "Live" : "Paused";
  elements.liveIndicator.classList.toggle("paused", !state.live);
  elements.toggleLive.textContent = state.live ? "Pause live feed" : "Resume live feed";
}

function rotateCampaign() {
  state.campaignIndex = (state.campaignIndex + 1) % campaigns.length;
  addActivity(`Campaign switched to ${campaigns[state.campaignIndex].name}.`);
  renderDashboard();
}

function tick() {
  if (!state.live) return;

  state.queue = clamp(state.queue + randomInt(-4, 5), 6, 34);
  state.agentsOnline = clamp(state.agentsOnline + randomInt(-1, 2), 36, 49);
  state.wrapUp = clamp(state.wrapUp + randomInt(-2, 2), 3, 10);
  state.sla = clamp(state.sla + randomInt(-3, 2), 75, 96);
  state.callsHandled += randomInt(8, 22);
  state.averageScore = clamp(state.averageScore + randomInt(-1, 1), 84, 97);

  const billing = clamp(state.mix.billing + randomInt(-3, 3), 18, 45);
  const sales = clamp(state.mix.sales + randomInt(-3, 3), 16, 42);
  const tech = clamp(100 - billing - sales, 20, 50);
  state.mix.billing = billing;
  state.mix.sales = 100 - billing - tech;
  state.mix.tech = tech;

  const rotatingStates = ["In call", "Wrap-up", "Break"];
  const pickedAgent = agents[randomInt(0, agents.length - 1)];
  pickedAgent.state = rotatingStates[randomInt(0, rotatingStates.length - 1)];

  renderAgents();
  renderDashboard();
  addActivity(activityTemplates[randomInt(0, activityTemplates.length - 1)]);
}

elements.toggleLive.addEventListener("click", () => {
  state.live = !state.live;
  addActivity(state.live ? "Live feed resumed for supervisors." : "Live feed paused for snapshot review.");
  renderDashboard();
});

elements.rotateCampaign.addEventListener("click", rotateCampaign);

renderAgents();
renderDashboard();
addActivity("PulseDesk demo is running with simulated inbound traffic.");
addActivity("Supervisor wallboard initialized successfully.");

setInterval(tick, 2200);
