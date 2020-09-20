from flask import Flask, request
from flask_restful import Resource, Api, reqparse
from decode64 import decodeBase64
from pytorch_infer import detectFace

app = Flask(__name__)
api = Api(app)


@app.route('/')
def hello_world():
    return 'Hello, World!'

class FaceDetect(Resource):

    def post(self, path):
        # the request into our API includes a uri and a base64 string for the image
        # parser = reqparse.RequestParser()
        # parser.add_argument('uri', type=str, required= True, help='uri has to be a string!')
        # parser.add_argument('base64', type=str, required= True, help='base64 is of string type')
        #
        # # parse arguments
        # args = parser.parse_args()

        # convert base64 to a .jpg image
        # base64code = args['base64']
        # succeededPath = decodeBase64(base64code)
        # # check
        # if (not succeededPath):
        #     raise Exception('decoding failed, image not saved')

        output = detectFace(path)

        sendBack = {'class id': [], 'conf': [], 'xmin': [], 'ymin': [], 'xmax': [], 'ymax': []}

        for face in output:
            i = 0
            for key in sendBack:
                val = float(face[i])
                sendBack[key].append(val)
                i += 1

        return sendBack

    # def post(self):
    #
    #     # the request into our API includes a uri and a base64 string for the image
    #     parser = reqparse.RequestParser()
    #     parser.add_argument('uri', type = str, required = true, help = 'uri has to be a string!')
    #     parser.add_argument('base64', type = str, required = true, help = 'base64 is of string type')
    #
    #     #parse arguments
    #     args = parser.parse_args()
    #
    #     #convert base64 to a .jpg image
    #     base64code = args['base64']
    #     succeededPath = decodeBase64(base64code)
    #     #check
    #     if (not succeededPath):
    #         raise Exception('decoding failed, image not saved')
    #
    #
    #     output = detectFace(succeededPath)
    #     sendBack = {'class id': [], 'conf': [], 'xmin': [], 'ymin': [], 'xmax': [], 'ymax': []}
    #
    #     for face in output:
    #         i = 0
    #         for key in sendBack:
    #             sendBack[key].append(face[i])
    #             i += 1
    #
    #     return sendBack

api.add_resource(FaceDetect, '/path/<string:path>')

if __name__ == '__main__':
    app.run(debug = True)