import Phaser from 'phaser'
import { EventBus } from '../game/EventBus'

export default class DentalScene extends Phaser.Scene {
  constructor() {
    super('DentalScene')
    this.activeTool = 'explorador'
    this.selectedTooth = null
    this.teeth = []
    this.score = 0
    this.audioContext = null
    this.hiddenCariesCount = 8
    this.flowPenalty = 5
  }

  create() {
    this.activeTool = 'explorador'
    this.selectedTooth = null
    this.teeth = []
    this.score = 0

    this.cameras.main.setBackgroundColor('#e8f3f8')

    this.createBackground()
    this.createMouth()
    this.createTeeth()
    this.generateRandomCaries()
    this.createTitle()

    EventBus.on('tool-changed', this.changeTool, this)
    EventBus.on('reset-treatment', this.resetTreatment, this)

    this.events.once('shutdown', () => {
      EventBus.off('tool-changed', this.changeTool, this)
      EventBus.off('reset-treatment', this.resetTreatment, this)
    })
  }

  createBackground() {
    const graphics = this.add.graphics()

    graphics.fillStyle(0xffffff, 1)
    graphics.fillRoundedRect(35, 35, 730, 530, 28)

    graphics.lineStyle(3, 0xcbd5e1, 1)
    graphics.strokeRoundedRect(35, 35, 730, 530, 28)

    graphics.fillStyle(0xf1f5f9, 1)
    graphics.fillRoundedRect(70, 85, 660, 425, 24)
  }

  createTitle() {
    this.add.text(400, 60, 'Vista odontológica 2D - 32 dientes', {
      fontFamily: 'Arial',
      fontSize: '22px',
      color: '#0f172a',
      fontStyle: 'bold'
    }).setOrigin(0.5)

    this.add.text(400, 540, 'Las caries son aleatorias. Sigue el flujo clínico para evitar perder puntos.', {
      fontFamily: 'Arial',
      fontSize: '16px',
      color: '#64748b'
    }).setOrigin(0.5)
  }

  createMouth() {
    const graphics = this.add.graphics()

    graphics.fillStyle(0xfda4af, 1)
    graphics.fillEllipse(400, 315, 540, 340)

    graphics.fillStyle(0xfb7185, 1)
    graphics.fillEllipse(400, 315, 470, 280)

    graphics.fillStyle(0x881337, 1)
    graphics.fillEllipse(400, 340, 330, 165)

    graphics.fillStyle(0xbe123c, 1)
    graphics.fillEllipse(400, 340, 250, 110)

    graphics.lineStyle(5, 0xe11d48, 1)
    graphics.strokeEllipse(400, 315, 540, 340)
  }

  getToothPoints() {
    return [
      0, -24,
      8, -23,
      15, -17,
      17, -8,
      16, 2,
      13, 13,
      9, 23,
      5, 28,
      1, 25,
      -2, 25,
      -6, 28,
      -10, 23,
      -13, 13,
      -16, 2,
      -17, -8,
      -15, -17,
      -8, -23
    ]
  }

    getToothType(number) {
    const types = {
      1: 'Tercer molar / muela del juicio',
      2: 'Segundo molar',
      3: 'Primer molar',
      4: 'Segundo premolar',
      5: 'Primer premolar',
      6: 'Canino',
      7: 'Incisivo lateral',
      8: 'Incisivo central',
      9: 'Incisivo central',
      10: 'Incisivo lateral',
      11: 'Canino',
      12: 'Primer premolar',
      13: 'Segundo premolar',
      14: 'Primer molar',
      15: 'Segundo molar',
      16: 'Tercer molar / muela del juicio',
      17: 'Tercer molar / muela del juicio',
      18: 'Segundo molar',
      19: 'Primer molar',
      20: 'Segundo premolar',
      21: 'Primer premolar',
      22: 'Canino',
      23: 'Incisivo lateral',
      24: 'Incisivo central',
      25: 'Incisivo central',
      26: 'Incisivo lateral',
      27: 'Canino',
      28: 'Primer premolar',
      29: 'Segundo premolar',
      30: 'Primer molar',
      31: 'Segundo molar',
      32: 'Tercer molar / muela del juicio'
    }

    return types[number] || 'Diente'
  }

  getToothVisualCondition(info) {
    if (info.isExtracted) return 'extraido'
    if (info.isRotten) return 'podrido'
    if (info.isSealed) return 'sellado'
    if (info.isTreated) return 'tratado'
    if (info.hasCaries) return 'caries'
    if (info.isHealthyConfirmed) return 'sano'
    if (info.isClean) return 'limpio'
    if (info.isAnesthetized) return 'anestesiado'
    if (info.isReviewed) return 'revisado'

    return 'normal'
  }

  getToothVisualText(info) {
    if (info.isExtracted) return 'Diente extraído'
    if (info.isRotten) return 'Diente podrido'
    if (info.isSealed) return 'Diente sellado'
    if (info.isTreated) return 'Tratamiento realizado'
    if (info.hasCaries) return 'Con caries'
    if (info.isHealthyConfirmed) return 'Diente sano'
    if (info.isClean) return 'Limpio'
    if (info.isAnesthetized) return 'Anestesiado'
    if (info.isReviewed) return 'Revisado'

    return 'Sin revisión'
  }

  createTeeth() {
    let number = 1

    const upperTotal = 16
    const lowerTotal = 16

    for (let i = 0; i < upperTotal; i++) {
      const t = i / (upperTotal - 1)
      const angle = Phaser.Math.Linear(Math.PI * 1.08, Math.PI * 1.92, t)

      const x = 400 + Math.cos(angle) * 260
      const y = 320 + Math.sin(angle) * 118
      const rotation = Phaser.Math.Linear(-22, 22, t)

      this.createTooth(x, y, rotation, number, 'Superior')
      number++
    }

    for (let i = 0; i < lowerTotal; i++) {
      const t = i / (lowerTotal - 1)
      const angle = Phaser.Math.Linear(Math.PI * 0.90, Math.PI * 0.10, t)

      const x = 400 + Math.cos(angle) * 260
      const y = 335 + Math.sin(angle) * 122
      const rotation = Phaser.Math.Linear(22, -22, t)

      this.createTooth(x, y, rotation, number, 'Inferior')
      number++
    }
  }

  createTooth(x, y, angle, number, arcada) {
    const tooth = this.add.container(x, y)
    const points = this.getToothPoints()

    const shadow = this.add.polygon(4, 6, points, 0x475569, 0.18)

    const body = this.add.polygon(0, 0, points, 0xfffbeb, 1)
    body.setStrokeStyle(3, 0xd6d3d1, 1)

    const shine = this.add.ellipse(-6, -10, 7, 12, 0xffffff, 0.35)

    const label = this.add.text(0, 1, number.toString(), {
      fontFamily: 'Arial',
      fontSize: '10px',
      color: '#334155',
      fontStyle: 'bold'
    }).setOrigin(0.5)

    tooth.add([shadow, body, shine, label])
    tooth.setSize(42, 58)
    tooth.setAngle(angle)
    tooth.setInteractive({ useHandCursor: true })

    tooth.dataInfo = {
      id: number,
      arcada,
      tipo: this.getToothType(number),
      estado: 'Sano',
      herramienta: 'Ninguna',
      body,
      shadow,
      shine,
      label,
      originalColor: 0xfffbeb,
      hasHiddenCaries: false,
      isRotten: false,
      isReviewed: false,
      hasCaries: false,
      isCariesDiagnosisDone: false,
      isHealthyConfirmed: false,
      isAnesthetized: false,
      isClean: false,
      isTreated: false,
      isSealed: false,
      isExtracted: false,
      cariesSpot: null,
      cariesSpotPosition: null,
      sealSpot: null,
      sealShine: null,
      actionCodes: [],
      historial: []
    }

    tooth.on('pointerdown', () => {
      this.selectTooth(tooth)
    })

    tooth.on('pointerover', () => {
      this.tweens.add({
        targets: tooth,
        scale: 1.08,
        duration: 120
      })
    })

    tooth.on('pointerout', () => {
      if (this.selectedTooth !== tooth) {
        this.tweens.add({
          targets: tooth,
          scale: 1,
          duration: 120
        })
      }
    })

    this.teeth.push(tooth)
  }

  generateRandomCaries() {
    const shuffled = [...this.teeth].sort(() => Math.random() - 0.5)
    const selected = shuffled.slice(0, this.hiddenCariesCount)

    selected.forEach((tooth) => {
      tooth.dataInfo.hasHiddenCaries = true
      // 30% de probabilidad de que un diente con caries esté podrido
      tooth.dataInfo.isRotten = Math.random() < 0.3
    })
  }

  changeTool(tool) {
    this.activeTool = tool
    this.playToolChangeSound()
  }

  selectTooth(tooth) {
    if (this.selectedTooth && this.selectedTooth !== tooth) {
      this.selectedTooth.setScale(1)
      this.refreshToothStyle(this.selectedTooth)
    }

    this.selectedTooth = tooth
    tooth.setScale(1.12)

    const result = this.applyTool(tooth)

    if (!result.changed && result.penalty > 0) {
      this.score = Math.max(0, this.score - result.penalty)
      tooth.dataInfo.historial.push(`Penalización: ${result.message}`)
    }

    this.refreshToothStyle(tooth)

    if (result.changed) {
      this.playActionSound(this.activeTool)
      this.pulseTooth(tooth)
      this.showFloatingText(tooth.x, tooth.y - 55, `+${result.points}`, '#15803d')
    } else if (result.penalty > 0) {
      this.playErrorSound()
      this.showFloatingText(tooth.x, tooth.y - 55, `-${result.penalty}`, '#dc2626')
    } else {
      this.playErrorSound()
      this.showFloatingText(tooth.x, tooth.y - 55, result.message, '#dc2626')
    }

    this.emitToothSelected(tooth, result.message)
  }

  applyTool(tooth) {
    if (this.activeTool === 'explorador') return this.applyReview(tooth)
    if (this.activeTool === 'caries') return this.applyCariesDiagnosis(tooth)
    if (this.activeTool === 'jeringa') return this.applyAnesthesia(tooth)
    if (this.activeTool === 'limpieza') return this.applyCleaning(tooth)
    if (this.activeTool === 'turbina') return this.applyTreatment(tooth)
    if (this.activeTool === 'sellado') return this.applySealant(tooth)

    return this.failWithPenalty('Herramienta no válida.')
  }

  applyReview(tooth) {
    const info = tooth.dataInfo

    if (info.isReviewed) {
      return this.failWithoutPenalty('Este diente ya fue revisado.')
    }

    info.isReviewed = true
    info.herramienta = 'Explorador'

    if (info.hasHiddenCaries) {
      info.hasCaries = true
      info.isCariesDiagnosisDone = true

      if (info.isRotten) {
        info.estado = 'Diente podrido - Requiere extracción'
        this.createRottenSpot(tooth)
        return this.registerAction(info, 'review-rotten', 'Diente podrido detectado - Requiere extracción', 8)
      } else {
        info.estado = 'Caries detectada'
        this.createCariesSpot(tooth)
        return this.registerAction(info, 'review-caries', 'Caries detectada', 8)
      }
    }

    info.isHealthyConfirmed = true
    info.estado = 'Sin caries'

    return this.registerAction(info, 'review', 'Diente sano - Sin caries', 5)
  }

  applyCariesDiagnosis(tooth) {
    const info = tooth.dataInfo

    if (!info.isReviewed) {
      return this.failWithPenalty('Primero revisa el diente con el explorador.')
    }

    if (info.isCariesDiagnosisDone) {
      return this.failWithoutPenalty('Este diente ya fue diagnosticado.')
    }

    if (info.isSealed) {
      return this.failWithoutPenalty('Este diente ya está sellado.')
    }

    info.isCariesDiagnosisDone = true
    info.herramienta = 'Diagnóstico de caries'

    if (!info.hasHiddenCaries) {
      info.isHealthyConfirmed = true

      return this.registerAction(
        info,
        'no-caries',
        'No se detectó caries en este diente',
        4
      )
    }

    info.hasCaries = true
    this.createCariesSpot(tooth)

    return this.registerAction(info, 'caries', 'Caries detectada', 8)
  }

  applyAnesthesia(tooth) {
    const info = tooth.dataInfo

    if (!info.isReviewed) {
      return this.failWithPenalty('Primero revisa el diente.')
    }

    if (!info.isCariesDiagnosisDone) {
      return this.failWithPenalty('Primero realiza el diagnóstico de caries.')
    }

    if (!info.hasCaries) {
      return this.failWithPenalty('No corresponde anestesia porque no se detectó caries.')
    }

    if (info.isSealed) {
      return this.failWithoutPenalty('Este diente ya está sellado.')
    }

    if (info.isAnesthetized) {
      return this.failWithoutPenalty('La anestesia ya fue aplicada.')
    }

    info.isAnesthetized = true
    info.herramienta = 'Jeringa'

    return this.registerAction(info, 'anesthesia', 'Anestesia aplicada', 10)
  }

  applyCleaning(tooth) {
    const info = tooth.dataInfo

    if (!info.isReviewed) {
      return this.failWithPenalty('Primero revisa el diente.')
    }

    if (info.isSealed) {
      return this.failWithoutPenalty('Este diente ya está sellado.')
    }

    if (info.isClean) {
      return this.failWithoutPenalty('La limpieza ya fue realizada.')
    }

    info.isClean = true
    info.herramienta = 'Limpieza'

    return this.registerAction(info, 'cleaning', 'Limpieza realizada', 10)
  }

  applyTreatment(tooth) {
    const info = tooth.dataInfo

    if (!info.isReviewed) {
      return this.failWithPenalty('Primero revisa el diente.')
    }

    if (!info.isCariesDiagnosisDone) {
      return this.failWithPenalty('Primero realiza el diagnóstico de caries.')
    }

    if (!info.hasCaries) {
      return this.failWithPenalty('No hay caries diagnosticada para tratar.')
    }

    if (!info.isAnesthetized) {
      return this.failWithPenalty('Primero aplica anestesia.')
    }

    if (info.isTreated) {
      return this.failWithoutPenalty('El tratamiento ya fue realizado.')
    }

    if (info.isSealed) {
      return this.failWithoutPenalty('Este diente ya está sellado.')
    }

    // Si el diente está podrido, se extrae en lugar de tratar
    if (info.isRotten) {
      info.isExtracted = true
      info.isTreated = true
      info.herramienta = 'Extracción'
      info.estado = 'Diente extraído'

      this.markToothAsExtracted(tooth)

      return this.registerAction(info, 'extraction', 'Diente podrido extraído', 20)
    }

    info.isTreated = true
    info.herramienta = 'Turbina'

    this.markCariesAsTreated(tooth)

    return this.registerAction(info, 'treatment', 'Tratamiento con turbina realizado', 15)
  }

  applySealant(tooth) {
    const info = tooth.dataInfo

    if (!info.isReviewed) {
      return this.failWithPenalty('Primero revisa el diente.')
    }

    if (info.isExtracted) {
      return this.failWithoutPenalty('No se puede sellar un diente extraído.')
    }

    if (info.isRotten) {
      return this.failWithoutPenalty('Dientes podridos requieren extracción, no sellado.')
    }

    if (info.hasCaries && !info.isTreated) {
      return this.failWithPenalty('Primero trata la caries antes de sellar.')
    }

    if (!info.isClean && !info.isTreated) {
      return this.failWithPenalty('Primero realiza limpieza o tratamiento.')
    }

    if (info.isSealed) {
      return this.failWithoutPenalty('El sellado ya fue aplicado.')
    }

    info.isSealed = true
    info.herramienta = 'Sellador'

    this.createSealSpot(tooth)

    return this.registerAction(info, 'sealant', 'Sellado dental aplicado', 12)
  }

  registerAction(info, code, detail, points) {
    if (info.actionCodes.includes(code)) {
      return this.failWithoutPenalty('Esta acción ya fue realizada.')
    }

    info.actionCodes.push(code)
    info.historial.push(detail)
    this.score += points
    this.updateClinicalState(info)

    return {
      changed: true,
      points,
      penalty: 0,
      message: detail
    }
  }

  failWithPenalty(message) {
    return {
      changed: false,
      points: 0,
      penalty: this.flowPenalty,
      message
    }
  }

  failWithoutPenalty(message) {
    return {
      changed: false,
      points: 0,
      penalty: 0,
      message
    }
  }

  updateClinicalState(info) {
    if (info.isExtracted) {
      info.estado = 'Diente extraído'
      return
    }

    if (info.isSealed) {
      info.estado = 'Sellado dental'
      return
    }

    if (info.isTreated) {
      info.estado = 'Tratamiento realizado'
      return
    }

    if (info.isRotten) {
      info.estado = 'Diente podrido - Requiere extracción'
      return
    }

    if (info.hasCaries) {
      info.estado = 'Caries detectada'
      return
    }

    if (info.isHealthyConfirmed) {
      info.estado = 'Sin caries'
      return
    }

    if (info.isClean) {
      info.estado = 'Limpio'
      return
    }

    if (info.isAnesthetized) {
      info.estado = 'Anestesiado'
      return
    }

    if (info.isReviewed) {
      info.estado = 'Revisado'
      return
    }

    info.estado = 'Sano'
  }

  createCariesSpot(tooth) {
    const info = tooth.dataInfo

    if (info.cariesSpot) return

    const x = info.id % 2 === 0 ? -7 : 7
    const y = info.id % 3 === 0 ? -7 : 6

    info.cariesSpotPosition = { x, y }

    const spot = this.add.ellipse(x, y, 9, 11, 0x92400e, 1)
    spot.setStrokeStyle(2, 0x78350f)

    tooth.add(spot)
    tooth.bringToTop(info.label)

    info.cariesSpot = spot
  }

  createRottenSpot(tooth) {
    const info = tooth.dataInfo

    if (info.cariesSpot) return

    const x = info.id % 2 === 0 ? -7 : 7
    const y = info.id % 3 === 0 ? -7 : 6

    info.cariesSpotPosition = { x, y }

    // Color más oscuro para diente podrido
    const spot = this.add.ellipse(x, y, 12, 14, 0x450a0a, 1)
    spot.setStrokeStyle(3, 0x7f1d1d)

    tooth.add(spot)
    tooth.bringToTop(info.label)

    info.cariesSpot = spot
  }

  markCariesAsTreated(tooth) {
    const info = tooth.dataInfo
    const position = info.cariesSpotPosition || { x: 6, y: 5 }

    if (info.cariesSpot) {
      info.cariesSpot.setPosition(position.x, position.y)
      info.cariesSpot.setSize(10, 10)
      info.cariesSpot.setFillStyle(0xfca5a5, 1)
      info.cariesSpot.setStrokeStyle(2, 0xef4444)
      return
    }

    const treatedMark = this.add.ellipse(position.x, position.y, 10, 10, 0xfca5a5, 1)
    treatedMark.setStrokeStyle(2, 0xef4444)

    tooth.add(treatedMark)
    tooth.bringToTop(info.label)

    info.cariesSpot = treatedMark
  }

  markToothAsExtracted(tooth) {
    const info = tooth.dataInfo

    // Remover la mancha de caries/podrido
    if (info.cariesSpot) {
      info.cariesSpot.destroy()
      info.cariesSpot = null
    }

    // Ocultar el cuerpo del diente
    info.body.setVisible(false)
    info.shadow.setVisible(false)
    info.shine.setVisible(false)
    info.label.setVisible(false)

    // Crear un hueco oscuro donde estaba el diente
    const hole = this.add.polygon(0, 0, this.getToothPoints(), 0x1f2937, 1)
    hole.setStrokeStyle(2, 0x374151, 1)

    tooth.add(hole)

    info.extractionHole = hole
  }

  createSealSpot(tooth) {
    const info = tooth.dataInfo

    if (info.sealSpot) return

    const position = info.cariesSpotPosition || { x: 0, y: 4 }

    if (info.cariesSpot) {
      info.cariesSpot.destroy()
      info.cariesSpot = null
    }

    const seal = this.add.ellipse(position.x, position.y, 12, 11, 0xc4b5fd, 1)
    seal.setStrokeStyle(2, 0x8b5cf6)

    const sealShine = this.add.ellipse(position.x - 2, position.y - 2, 4, 3, 0xffffff, 0.55)

    tooth.add(seal)
    tooth.add(sealShine)
    tooth.bringToTop(info.label)

    info.sealSpot = seal
    info.sealShine = sealShine
  }

  refreshToothStyle(tooth) {
    const info = tooth.dataInfo

    // Si el diente está extraído, no modificar el estilo del cuerpo (está oculto)
    if (info.isExtracted) {
      return
    }

    const fillColor = this.getToothColor(info)

    let borderColor = 0xd6d3d1
    let lineWidth = 3

    if (this.selectedTooth === tooth) {
      borderColor = 0x2563eb
      lineWidth = 4
    } else if (info.isRotten && !info.isExtracted) {
      borderColor = 0x7f1d1d
      lineWidth = 4
    } else if (info.hasCaries && !info.isTreated) {
      borderColor = 0x92400e
      lineWidth = 4
    } else if (info.isHealthyConfirmed) {
      borderColor = 0x16a34a
      lineWidth = 4
    } else if (info.isSealed) {
      borderColor = 0x8b5cf6
      lineWidth = 4
    } else if (info.isTreated) {
      borderColor = 0xef4444
      lineWidth = 4
    }

    info.body.setFillStyle(fillColor, 1)
    info.body.setStrokeStyle(lineWidth, borderColor, 1)
  }

  getToothColor(info) {
    if (info.isExtracted) return 0x6b7280
    if (info.isSealed) return 0xc4b5fd
    if (info.isTreated) return 0xfca5a5
    if (info.isHealthyConfirmed) return 0xdcfce7
    if (info.isClean) return 0xbbf7d0
    if (info.isAnesthetized) return 0xbfdbfe
    if (info.isReviewed) return 0xfef3c7

    return info.originalColor
  }

  pulseTooth(tooth) {
    const finalScale = this.selectedTooth === tooth ? 1.12 : 1

    this.tweens.add({
      targets: tooth,
      scale: finalScale + 0.08,
      duration: 90,
      yoyo: true,
      onComplete: () => {
        tooth.setScale(finalScale)
      }
    })
  }

  showFloatingText(x, y, message, color) {
    const text = this.add.text(x, y, message, {
      fontFamily: 'Arial',
      fontSize: '14px',
      color,
      fontStyle: 'bold',
      backgroundColor: '#ffffff',
      padding: {
        x: 8,
        y: 4
      }
    }).setOrigin(0.5)

    this.tweens.add({
      targets: text,
      y: y - 28,
      alpha: 0,
      duration: 900,
      ease: 'Power2',
      onComplete: () => {
        text.destroy()
      }
    })
  }

  emitToothSelected(tooth, message = '') {
    if (!tooth) {
      EventBus.emit('tooth-selected', null)
      return
    }

    const info = tooth.dataInfo

    EventBus.emit('tooth-selected', {
  id: info.id,
  arcada: info.arcada,
  tipo: info.tipo,
  estado: info.estado,
  herramienta: info.herramienta,
  condicionVisual: this.getToothVisualCondition(info),
  condicionTexto: this.getToothVisualText(info),
  score: this.score,
  mensaje: message,
  historial: [...info.historial],
  progreso: this.getProgress()
})
  }

  getProgress() {
    const total = this.teeth.length

    const revisados = this.teeth.filter((tooth) => tooth.dataInfo.isReviewed).length
    const caries = this.teeth.filter((tooth) => tooth.dataInfo.hasCaries).length
    const podridos = this.teeth.filter((tooth) => tooth.dataInfo.isRotten).length
    const extraidos = this.teeth.filter((tooth) => tooth.dataInfo.isExtracted).length
    const sinCaries = this.teeth.filter((tooth) => tooth.dataInfo.isHealthyConfirmed).length
    const anestesiados = this.teeth.filter((tooth) => tooth.dataInfo.isAnesthetized).length
    const limpios = this.teeth.filter((tooth) => tooth.dataInfo.isClean).length
    const tratados = this.teeth.filter((tooth) => tooth.dataInfo.isTreated).length
    const sellados = this.teeth.filter((tooth) => tooth.dataInfo.isSealed).length

    return {
      total,
      revisados,
      caries,
      podridos,
      extraidos,
      sinCaries,
      anestesiados,
      limpios,
      tratados,
      sellados,
      cariesOcultas: this.hiddenCariesCount
    }
  }

  resetTreatment() {
    this.score = 0
    this.selectedTooth = null
    this.playResetSound()

    this.teeth.forEach((tooth) => {
      const info = tooth.dataInfo

      tooth.setScale(1)

      info.estado = 'Sano'
      info.herramienta = 'Ninguna'
      info.hasHiddenCaries = false
      info.isRotten = false
      info.isReviewed = false
      info.hasCaries = false
      info.isCariesDiagnosisDone = false
      info.isHealthyConfirmed = false
      info.isAnesthetized = false
      info.isClean = false
      info.isTreated = false
      info.isSealed = false
      info.isExtracted = false
      info.cariesSpotPosition = null
      info.actionCodes = []
      info.historial = []

      if (info.cariesSpot) {
        info.cariesSpot.destroy()
        info.cariesSpot = null
      }

      if (info.sealSpot) {
        info.sealSpot.destroy()
        info.sealSpot = null
      }

      if (info.sealShine) {
        info.sealShine.destroy()
        info.sealShine = null
      }

      if (info.extractionMark) {
        info.extractionMark.destroy()
        info.extractionMark = null
      }

      if (info.extractionHole) {
        info.extractionHole.destroy()
        info.extractionHole = null
      }

      // Restaurar visibilidad del diente
      info.body.setVisible(true)
      info.shadow.setVisible(true)
      info.shine.setVisible(true)
      info.label.setVisible(true)

      this.refreshToothStyle(tooth)
    })

    this.generateRandomCaries()
    EventBus.emit('tooth-selected', null)
  }

  getAudioContext() {
    if (!this.audioContext) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext
      this.audioContext = new AudioContextClass()
    }

    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume()
    }

    return this.audioContext
  }

  playTone(frequency, duration = 0.12, type = 'sine', volume = 0.08) {
    const context = this.getAudioContext()
    const oscillator = context.createOscillator()
    const gain = context.createGain()

    oscillator.type = type
    oscillator.frequency.setValueAtTime(frequency, context.currentTime)

    gain.gain.setValueAtTime(volume, context.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + duration)

    oscillator.connect(gain)
    gain.connect(context.destination)

    oscillator.start()
    oscillator.stop(context.currentTime + duration)
  }

  playSequence(notes) {
    const context = this.getAudioContext()

    notes.forEach((note) => {
      const oscillator = context.createOscillator()
      const gain = context.createGain()

      oscillator.type = note.type || 'sine'
      oscillator.frequency.setValueAtTime(note.frequency, context.currentTime + note.delay)

      gain.gain.setValueAtTime(note.volume || 0.07, context.currentTime + note.delay)
      gain.gain.exponentialRampToValueAtTime(
        0.001,
        context.currentTime + note.delay + note.duration
      )

      oscillator.connect(gain)
      gain.connect(context.destination)

      oscillator.start(context.currentTime + note.delay)
      oscillator.stop(context.currentTime + note.delay + note.duration)
    })
  }

  playToolChangeSound() {
    this.playTone(520, 0.06, 'sine', 0.035)
  }

  playActionSound(tool) {
    if (tool === 'explorador') {
      this.playSequence([
        { frequency: 420, duration: 0.07, delay: 0, type: 'sine' },
        { frequency: 620, duration: 0.08, delay: 0.08, type: 'sine' }
      ])
      return
    }

    if (tool === 'jeringa') {
      this.playSequence([
        { frequency: 760, duration: 0.09, delay: 0, type: 'triangle' },
        { frequency: 920, duration: 0.07, delay: 0.09, type: 'triangle' }
      ])
      return
    }

    if (tool === 'limpieza') {
      this.playSequence([
        { frequency: 900, duration: 0.05, delay: 0, type: 'sine' },
        { frequency: 1200, duration: 0.05, delay: 0.06, type: 'sine' },
        { frequency: 1500, duration: 0.08, delay: 0.12, type: 'sine' }
      ])
      return
    }

    if (tool === 'turbina') {
      this.playSequence([
        { frequency: 180, duration: 0.05, delay: 0, type: 'sawtooth', volume: 0.045 },
        { frequency: 230, duration: 0.05, delay: 0.05, type: 'sawtooth', volume: 0.045 },
        { frequency: 180, duration: 0.05, delay: 0.10, type: 'sawtooth', volume: 0.045 },
        { frequency: 260, duration: 0.08, delay: 0.15, type: 'sawtooth', volume: 0.045 }
      ])
      return
    }

    if (tool === 'caries') {
      this.playSequence([
        { frequency: 320, duration: 0.09, delay: 0, type: 'square', volume: 0.05 },
        { frequency: 250, duration: 0.10, delay: 0.10, type: 'square', volume: 0.05 }
      ])
      return
    }

    if (tool === 'sellado') {
      this.playSequence([
        { frequency: 523, duration: 0.07, delay: 0, type: 'sine' },
        { frequency: 659, duration: 0.07, delay: 0.08, type: 'sine' },
        { frequency: 784, duration: 0.12, delay: 0.16, type: 'sine' }
      ])
      return
    }

    this.playTone(500, 0.1, 'sine')
  }

  playErrorSound() {
    this.playSequence([
      { frequency: 180, duration: 0.11, delay: 0, type: 'square', volume: 0.055 },
      { frequency: 120, duration: 0.13, delay: 0.12, type: 'square', volume: 0.055 }
    ])
  }

  playResetSound() {
    this.playSequence([
      { frequency: 600, duration: 0.06, delay: 0, type: 'sine', volume: 0.05 },
      { frequency: 420, duration: 0.06, delay: 0.07, type: 'sine', volume: 0.05 },
      { frequency: 280, duration: 0.08, delay: 0.14, type: 'sine', volume: 0.05 }
    ])
  }
}