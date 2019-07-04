using FCM.Net;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Web.Http;

namespace FCM.PushNotification.Controllers
{
    public class ValuesController : ApiController
    {

        [HttpGet]
        [Route("sendmessage")]
        public async Task<IHttpActionResult> SendMessage()
        {
            List<string> registrationId = new List<string>();

            //tokenGerado = Token gerado pelo aplicativo

            registrationId.Add("tokenGerado");

            // Sender Id === Firebase 

            using (var sender = new Sender("senderId"))
            {
                var message = new Message
                {
                    RegistrationIds = registrationId,
                    Notification = new Notification
                    {
                        Title = "Teste de Notificação",
                        Body = $"Rolouuuuuuu !!!! "
                    }
                };
                var result = await sender.SendAsync(message);
                Console.WriteLine($"Success: {result.MessageResponse.Success}");
            }
            return Ok();
        }
    }
}
