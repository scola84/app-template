document.addEventListener('DOMContentLoaded', () => {
  document.cookie = `tz=${Intl.DateTimeFormat().resolvedOptions().timeZone}; Path=/; SameSite=Strict`

  if (window.parent !== window) {
    document.body.classList.add('framed')
  }

  document
    .querySelectorAll<HTMLOutputElement>('output[data-me-output]')
    .forEach((element) => {
      const output = new Output(element)
      output.setup()
    })
})

class Output {
  public element: HTMLOutputElement

  public constructor (element: HTMLOutputElement) {
    this.element = element
  }

  public setup (): void {
    Array
      .from(this.element.querySelectorAll<HTMLElement>('.message'))
      .reduce(async (promise, message) => {
        await promise
          .then(async () => {
            await this.handleMessage(message)
          })
      }, Promise.resolve())
      .catch(() => {})
  }

  private async handleMessage (message: HTMLElement): Promise<void> {
    await new Promise<void>((resolve) => {
      const timeout = Number(message.dataset.meHideAfter ?? 0)

      message.addEventListener('transitionend', () => {
        if (!message.classList.contains('visible')) {
          message.remove()
          resolve()
        }
      })

      message.classList.add('visible')

      if (
        message.classList.contains('transition') &&
          timeout > 0
      ) {
        window.setTimeout(() => {
          message.classList.remove('visible')
        }, timeout)
      } else {
        resolve()
      }
    })
  }
}
