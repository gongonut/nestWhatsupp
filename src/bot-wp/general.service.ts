import { Injectable } from '@nestjs/common';
import { OpenAI } from 'openai';
import { addKeyword, EVENTS } from '@builderbot/bot'
import { MemoryDB as Database } from '@builderbot/bot'
import { BaileysProvider as Provider } from '@builderbot/provider-baileys'

interface UserQueue {
    from: string;
    thread: string;
    runId?: string;
    ctx: any;
    actualMenu: string;
    status: string;
    idleStep: number;
    messagetimestamp: number;
    messages: { role: string, content: string, time: number }[]
}


@Injectable()
export class GeneralService {
    
   // PORT = process.env.PORT ?? 3008;
    // const { ASSISTANT_ID, OPENAI_API_KEY, IDLE_MINUTES } = process.env;
    userQueues: UserQueue[] = [];
    pollingInterval: any;
    
    // setup OpenAI client
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    
    defaultFlow = addKeyword<Provider, Database>(EVENTS.WELCOME)
        .addAction(
            async (ctx, ctxFn) => {
                if (process.env.NODE_STATUS === 'stopped') {
                    ctxFn.flowDynamic('Servidor apagado');
                    return;
                }
    
                const user = this.userQueues.find(u => u.from === ctx.from);
                if (!user) {
                    // userQueues.set(ctx.from, { ...ctx, ...{ menuStatus: 0 } });
                    const thread = await this.createThread();
                    this.userQueues.push({
                        from: ctx.from,
                        thread: thread.id,
                        ctx,
                        actualMenu: 'NONE',
                        status: 'pending',
                        idleStep: 0,
                        messagetimestamp: Date.now(),
                        messages: [{ role: "user", content: ctx.body, time: Date.now() }],
                    });
                    ctxFn.gotoFlow(this.welcomeFlow);
                } else {
                    if (ctx.body === '0') { ctxFn.gotoFlow(this.menuFlow); }
                    switch (user.actualMenu) {
                        case '1':
                        case '2':
                            if (user.status === 'pending') {
                                user.status = 'starting';
                                ctxFn.flowDynamic('Un momento por favor, estamos procesando su consulta...');
                                this.sendProductMessage(user.thread, ctx.body).then(answer => {
                                    this.runAssistant(user.thread).then(run => {
                                        user.runId = run.id;
    
                                        // Check the status
                                        this.pollingInterval = setInterval(() => {
                                            this.checkingStatus(ctxFn, user, user.runId);
                                        }, 2000);
                                    });
                                });
                            } else {
                                // openai.beta.threads.runs.cancel(user.thread, user.runId);
                                // ctxFn.flowDynamic('Cancelando consulta anterior... Por favor escriba su nueva consulta');
                                ctxFn.gotoFlow(this.pendingFlow);
                            }
                            break;
                        case '3':
                            // ctxFn.gotoFlow(contactFlow);
                            break;
                        case '11':
                            ctxFn.flowDynamic('Gracias por tu consulta');
                            this.userQueues.splice(this.userQueues.indexOf(user), 1);
                            ctxFn.gotoFlow(this.menuFlow);
                            break;
                    }
                }
    
            }
        )
    
    pendingFlow = addKeyword<Provider, Database>(EVENTS.ACTION)
        .addAnswer('Procesando consulta anterior, espere por favor...')
    
    welcomeFlow = addKeyword<Provider, Database>(EVENTS.ACTION)
        .addAnswer(`Hola, bienvenido a *Cyber Cloud*`, { media: 'https://static.wixstatic.com/media/82643f_e3ce633fe3dd4190bc3f59047d7517a9~mv2.jpg/v1/fill/w_193,h_79,al_c,q_80,usm_0.66_1.00_0.01,enc_auto/SYT%20logo-02.jpg' })
        .addAnswer('Este es nuestro chat general. Elige una opción del *Menú* para ayudarte a resolver tus dudas', { delay: 800 })
        .addAction(
            async (_, ctxFn) => { ctxFn.gotoFlow(this.menuFlow); }
        )
    
    menuFlow = addKeyword<Provider, Database>(EVENTS.ACTION)
        .addAnswer(`*Menú*
                        1. Nuestros productos IA.
                        2. Soporte IA.
                        3. Contactar con un asesor.
                        0. Regresar al *Menú*.
                        11. Finalizar conversación.`, { capture: true },
            async (ctx, ctxFn) => {
                if (!['1', '2', '3', 'E'].includes(ctx.body[0])) { ctxFn.gotoFlow(this.menuFlow); }
                const from = this.userQueues.find(u => u.from === ctx.from);
                if (from) {
                    from.actualMenu = ctx.body;
                    from.messages.push({ role: "user", content: ctx.body, time: Date.now() });
                }
                // userQueues.set(ctx.from, [...[{ menu: ctx.body, messageTimestamp: ctx.messageTimestamp }], ...userQueues.get(ctx.from)]);
                // console.log(userQueues)
                switch (ctx.body) {
                    case '1':
                        await ctxFn.flowDynamic('Haz seleccionado: *Asesor de productos IA*. Escribe tu pregunta o consulta.');
                        await ctxFn.flowDynamic('Para regresar al *Menú* escribe *0*.');
                        break;
                    case '2':
                        // ctxFn.gotoFlow(SupportFlow);
                        await ctxFn.flowDynamic('Haz seleccionado: *Soporte IA*. Escribe tu pregunta o consulta.');
                        await ctxFn.flowDynamic('Para regresar al *Menú* escribe *0*.');
                        break;
                    case '3':
                        //ctxFn.gotoFlow(ContactFlow);
                        await ctxFn.flowDynamic('Haz seleccionado: *Contactar con un asesor*')
                        await ctxFn.flowDynamic('Espera un momento por favor, pronto un asesor te atenderá.')
                        await ctxFn.flowDynamic('Para regresar al *Menú* escribe *0*');
                        break;
                }
            });
    
    /*
    const SupportFlow = addKeyword<Provider, Database>(EVENTS.ACTION)
    .addAnswer('*Soporte IA*')
    .addAnswer('Escriba su pregunta o consulta.')
    .addAnswer('Para regresar al *Menú* escribe *0*');
    
    const ContactFlow = addKeyword<Provider, Database>(EVENTS.ACTION)
    .addAnswer('*Contactar con un asesor*')
    .addAnswer('Espere un momento por favor, pronto un asesor le atendera.')
    .addAnswer('Para regresar al *Menú* escribe *0*');
    
    const ProductsFlow = addKeyword<Provider, Database>(EVENTS.ACTION)
    .addAnswer('*Asesor de productos IA*')
    .addAnswer('Para regresar al *Menú* escribe *0*');
    */
    
    async createThread() {
        const thread = await this.openai.beta.threads.create({});
        return thread;
    }
    
    async sendProductMessage(threadId, message) {
        const response = await this.openai.beta.threads.messages.create(threadId, {
            role: "user", content: message
        });
        return response;
    }
    
    async runAssistant(threadId) {
        // console.log('Running assistant for thread: ' + threadId)
        const response = await this.openai.beta.threads.runs.create(
            threadId,
            {
                assistant_id: process.env.ASSISTANT_ID
                // Make sure to not overwrite the original instruction, unless you want to
            }
        );
    
        // console.log(response)
    
        return response;
    }
    
    
    async checkingStatus(ctxFn, user, runId) {
        const runObject = await this.openai.beta.threads.runs.retrieve(
            user.thread,
            runId
        );
    
        // const status = runObject.status;
        user.status = runObject.status;
        // console.log(runObject)
        console.log('Current status: ' + user.status);
    
        if (user.status == 'completed') {
            clearInterval(this.pollingInterval);
    
            const messagesList = await this.openai.beta.threads.messages.list(user.thread);
            const messages = []
    
            messagesList.data.forEach(message => {
                messages.push(message.content);
            });
    
            const message = messagesList.data[0].content[0] as any;
            // console.log('Message: ' + message);
            // console.log(message.text.value);
            ctxFn.flowDynamic(message.text.value);
            await ctxFn.flowDynamic('Para regresar al *Menú* escriba *0*.');
            user.status = 'pending';
            //return messages;
        } else if (['failed', 'cancelled', 'expired'].includes(user.status)) {
            clearInterval(this.pollingInterval);
            ctxFn.flowDynamic(`Error: ${user.status}, por favor intentelo de nuevo.`);
            user.status = 'pending';
        }
    }
}
