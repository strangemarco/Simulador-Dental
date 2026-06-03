<template>
  <div class="app">
    <header class="topbar">
      <div class="brand">
        <div class="brand-icon">
          <Stethoscope />
        </div>

        <div>
          <div class="eyebrow">Laboratorio odontológico</div>
          <h1>Simulador Dental 2D</h1>
        </div>
      </div>

      <div class="header-actions">
        <div class="mini-stat">
          <Activity />
          <div>
            <span>Modo</span>
            <strong>Práctica</strong>
          </div>
        </div>

        <div class="score-card">
          <Trophy />
          <div>
            <span>Puntaje</span>
            <strong>{{ score }}</strong>
          </div>
        </div>
      </div>
    </header>

    <main class="layout">
      <section class="simulator-area">
        <div class="simulator-toolbar">
          <div>
            <span>Área de simulación</span>
            <strong>Vista bucal 2D interactiva</strong>
          </div>

          <div class="tool-selected">
            <component :is="currentTool.icon" />
            <span>{{ currentTool.name }}</span>
          </div>
        </div>

        <div ref="gameContainer" class="game-container"></div>
      </section>

      <aside class="panel tools-panel">
        <div class="panel-header">
          <div>
            <span class="panel-kicker">Paso clínico</span>
            <h2>Herramientas</h2>
          </div>
          <ClipboardList class="panel-header-icon" />
        </div>

        <div class="tool-list">
          <button
            v-for="tool in tools"
            :key="tool.id"
            class="tool-button"
            :class="{ active: activeTool === tool.id }"
            @click="changeTool(tool.id)"
          >
            <span class="tool-icon">
              <component :is="tool.icon" />
            </span>

            <div class="tool-content">
              <strong>{{ tool.name }}</strong>
              <small>{{ tool.description }}</small>
            </div>

            <CheckCircle2 v-if="activeTool === tool.id" class="active-check" />
          </button>
        </div>

        <div class="workflow-card">
          <h3>Flujo recomendado</h3>

          <div class="workflow-step">
            <span>1</span>
            <p>Revisar diente</p>
          </div>

          <div class="workflow-step">
            <span>2</span>
            <p>Aplicar anestesia</p>
          </div>

          <div class="workflow-step">
            <span>3</span>
            <p>Tratamiento o extracción</p>
          </div>

          <div class="workflow-step">
            <span>4</span>
            <p>Sellado si corresponde</p>
          </div>
        </div>

        <button class="reset-button" @click="resetTreatment">
          <RotateCcw />
          Reiniciar simulación
        </button>
      </aside>

      <aside class="panel detail-panel">
        <div class="panel-header">
          <div>
            <span class="panel-kicker">Evaluación</span>
            <h2>Detalle clínico</h2>
          </div>
          <Info class="panel-header-icon" />
        </div>

        <div v-if="selectedTooth" class="info-card">
          <div class="tooth-title">
            <div class="tooth-badge">
              <CircleDot />
            </div>
            <div>
              <span>Diente seleccionado</span>
              <strong>#{{ selectedTooth.id }}</strong>
            </div>
          </div>

         <div class="tooth-visual-card">
  <div
    class="tooth-preview"
    :class="selectedTooth.condicionVisual"
  >
    <span v-if="selectedTooth.condicionVisual === 'extraido'"></span>
  </div>

  <div class="tooth-visual-info">
    <span>Vista del diente</span>
    <strong>{{ selectedTooth.condicionTexto }}</strong>
  </div>
</div>

<div class="clinical-row">
  <span>Tipo de diente</span>
  <strong>{{ selectedTooth.tipo }}</strong>
</div>

<div class="clinical-row">
  <span>Arcada</span>
  <strong>{{ selectedTooth.arcada }}</strong>
</div>

<div class="clinical-row">
  <span>Estado</span>
  <strong>{{ selectedTooth.estado }}</strong>
</div>

          <div class="clinical-row">
            <span>Herramienta</span>
            <strong>{{ selectedTooth.herramienta }}</strong>
          </div>

          <div v-if="selectedTooth.mensaje" class="message-box">
            <AlertTriangle />
            <span>{{ selectedTooth.mensaje }}</span>
          </div>
        </div>

        <div v-else class="info-card empty-state">
          <CircleDot />
          <strong>Ningún diente seleccionado</strong>
          <p>Selecciona una herramienta y luego haz clic sobre un diente.</p>
        </div>

        <div v-if="selectedTooth?.historial?.length" class="history-card">
          <h3>Historial del diente</h3>

          <div
            v-for="(item, index) in selectedTooth.historial"
            :key="index"
            class="history-item"
          >
            <span>{{ index + 1 }}</span>
            <p>{{ item }}</p>
          </div>
        </div>

        <div class="case-card">
          <h3>Caso práctico</h3>
          <p>
            El estudiante debe revisar la boca, detectar caries, aplicar anestesia,
            realizar limpieza y simular un tratamiento básico.
          </p>
        </div>

        <div v-if="selectedTooth?.progreso" class="progress-card">
          <h3>Progreso general</h3>

          <div class="progress-grid">
            <div>
              <span>{{ selectedTooth.progreso.revisados }}</span>
              <p>Revisados</p>
            </div>

            <div>
              <span>{{ selectedTooth.progreso.caries }}</span>
              <p>Caries</p>
            </div>

            <div>
              <span>{{ selectedTooth.progreso.podridos }}</span>
              <p>Podridos</p>
            </div>

            <div>
              <span>{{ selectedTooth.progreso.extraidos }}</span>
              <p>Extraídos</p>
            </div>

            <div>
              <span>{{ selectedTooth.progreso.tratados }}</span>
              <p>Tratados</p>
            </div>

            <div>
              <span>{{ selectedTooth.progreso.sellados }}</span>
              <p>Sellados</p>
            </div>
          </div>
        </div>

        <div class="legend">
          <h3>Leyenda</h3>

          <p><span class="dot yellow"></span> Revisado</p>
          <p><span class="dot blue"></span> Anestesiado</p>
          <p><span class="dot green"></span> Limpio</p>
          <p><span class="dot red"></span> Tratamiento</p>
          <p><span class="dot brown"></span> Caries</p>
          <p><span class="dot dark-red"></span> Podrido</p>
          <p><span class="dot gray"></span> Extraído</p>
          <p><span class="dot purple"></span> Sellado</p>
        </div>
      </aside>
    </main>
  </div>
</template>

<script>
import Phaser from 'phaser'
import DentalScene from './scenes/DentalScene'
import { EventBus } from './game/EventBus'

import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  CircleDot,
  ClipboardList,
  Info,
  RotateCcw,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Syringe,
  Trophy
} from 'lucide-vue-next'

export default {
  name: 'App',

  components: {
    Activity,
    AlertTriangle,
    CheckCircle2,
    CircleDot,
    ClipboardList,
    Info,
    RotateCcw,
    Stethoscope,
    Trophy
  },

  data() {
    return {
      game: null,
      activeTool: 'explorador',
      selectedTooth: null,
      score: 0,
      resizeTimer: null,
      tools: [
        {
          id: 'explorador',
          name: 'Explorador',
          description: 'Revisión inicial del diente',
          icon: Search
        },
        {
          id: 'jeringa',
          name: 'Jeringa',
          description: 'Aplicación de anestesia',
          icon: Syringe
        },
        {
          id: 'limpieza',
          name: 'Limpieza',
          description: 'Profilaxis dental',
          icon: Sparkles
        },
        {
          id: 'turbina',
          name: 'Turbina',
          description: 'Tratamiento dental',
          icon: Settings
        },
        {
          id: 'caries',
          name: 'Caries',
          description: 'Diagnóstico de lesión dental',
          icon: CircleDot
        },
        {
          id: 'sellado',
          name: 'Sellado',
          description: 'Aplicación de sellador',
          icon: ShieldCheck
        }
      ]
    }
  },

  computed: {
    currentTool() {
      return this.tools.find((tool) => tool.id === this.activeTool) || this.tools[0]
    }
  },

  mounted() {
    this.createGame()

    EventBus.on('tooth-selected', (data) => {
      this.selectedTooth = data

      if (data) {
        this.score = data.score
      } else {
        this.score = 0
      }
    })

    window.addEventListener('resize', this.refreshGameScale)
  },

  beforeUnmount() {
    EventBus.removeAllListeners()
    window.removeEventListener('resize', this.refreshGameScale)

    if (this.resizeTimer) {
      clearTimeout(this.resizeTimer)
    }

    if (this.game) {
      this.game.destroy(true)
    }
  },

  methods: {
    createGame() {
      this.game = new Phaser.Game({
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        parent: this.$refs.gameContainer,
        backgroundColor: '#e8f3f8',
        scene: [DentalScene],
        scale: {
          mode: Phaser.Scale.FIT,
          autoCenter: Phaser.Scale.CENTER_BOTH
        }
      })
    },

    refreshGameScale() {
      if (this.resizeTimer) {
        clearTimeout(this.resizeTimer)
      }

      this.resizeTimer = setTimeout(() => {
        if (this.game && this.game.scale) {
          this.game.scale.refresh()
        }
      }, 150)
    },

    changeTool(toolId) {
      this.activeTool = toolId
      EventBus.emit('tool-changed', toolId)
    },

    resetTreatment() {
      EventBus.emit('reset-treatment')
      this.selectedTooth = null
      this.score = 0
    }
  }
}
</script>