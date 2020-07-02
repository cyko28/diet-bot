class Shutdown {
    constructor(bot, commandQueue) {
        this.bot = bot;
        this.commandQueue = commandQueue;
        this.commands = ['shutdown'];
        this.canShutdown = false;
        this.shutdownPermissionId = null;
        this.initialMessageID = null;
    }
    init() {
        this.bot.on('message', (message) => {
            // only check if this is the message *following*
            // the initial message and can shutdown has been flagged
            const senderHasPermission =
                message.member.id === this.shutdownPermissionId;
            const isOriginalMessage = message.id === this.initialMessageID;

            if (this.canShutdown && !isOriginalMessage && senderHasPermission) {
                // clean content
                const messageContent = message.content.toLowerCase().trim();

                // validity checks
                const messageIsYes =
                    messageContent === 'y' || messageContent === 'yes';

                // if validity check is true
                if (messageIsYes) {
                    // log the shutdown to console
                    console.log(
                        `\n[Shutdown Plugin]\n${message.member.displayName} Confirmed Shutdown. Shutting down in 5 Seconds`
                    );

                    // tell the discord
                    message.reply('Shutting Down in 5 seconds');

                    // shut down
                    setTimeout(() => {
                        console.log(
                            `\n[Shutdown Plugin]\n${message.member.displayName} Shutdown Command Sent`
                        );
                        process.exitCode = 0;
                        process.exit();
                    }, 5000);
                } else {
                    // otherwise, reinit

                    // log the reversion to console
                    console.log(
                        `\n[Shutdown Plugin]\nShutdown Cancelled. Conditions not met.`
                    );

                    // tell the discord
                    message.reply('Shutdown Cancelled.');

                    this.reinitFailsales();
                }
            }
        });
    }
    run(message, params = [], command) {
        console.log(
            `\n[Shutdown Plugin]\n${message.member.displayName} Initiated Shutdown`
        );

        message.reply('**Are you sure?** `Y`es /  `N`o');
        this.initialMessageID = message.id;
        this.shutdownPermissionId = message.member.id;
        this.canShutdown = true;
    }
    reinitFailsales() {
        this.canShutdown = false;
        this.shutdownPermissionId = null;
        this.initialMessageID = null;
    }
}

module.exports = Shutdown;
