/* based on 'omr.angularFileDnD'' module by Louis Sivillo*/

angular.module('d3projApp')
  .directive('fileDropzone', function($log, docIconSize) {
    return {
      restrict: 'A',
      scope: {
        file: '=',
        fileName: '='
      },
      link: function(scope, element, attrs) {
        var checkSize, getDataTransfer, isTypeValid, processDragOverOrEnter, validMimeTypes;
        getDataTransfer = function(event) {
          var dataTransfer = event.dataTransfer || event.originalEvent.dataTransfer;
          return dataTransfer;
        };
        processDragOverOrEnter = function(event) {
          if (event) {
            if (event.preventDefault) {
              event.preventDefault();
            }
            if (event.stopPropagation) {
              return false;
            }
          }
          getDataTransfer(event).effectAllowed = 'copy';
          return false;
        };
        validMimeTypes = attrs.fileDropzone;
        checkSize = function(size) {
          var _ref;
          if (((_ref = attrs.maxFileSize) === (void 0) || _ref === '') || (size / 1024) / 1024 < attrs.maxFileSize) {
            return true;
          } else {
            alert("File must be smaller than " + attrs.maxFileSize + " MB");
            return false;
          }
        };
        isTypeValid = function(type) {
          if ((validMimeTypes === (void 0) || validMimeTypes === '') || validMimeTypes.indexOf(type) > -1) {
            return true;
          } else {
            alert("Invalid file type.  File must be one of following types " + validMimeTypes);
            return false;
          }
        };
        element.bind('dragover', processDragOverOrEnter);
        element.bind('dragenter', processDragOverOrEnter);

        return element.bind('drop', function(event) {
          var file, name, reader, size, type, p;
          if (event != null) {
            event.preventDefault();
          }

          reader = new FileReader();
          reader.onload = function(evt) {

            if (checkSize(size) && isTypeValid(type)) {
              scope.$apply(function() {
                scope.file = evt.target.result;
                if (angular.isString(scope.fileName)) {
                  return scope.fileName = name;
                }
              });
              return scope.$emit('file-dropzone-drop-event', {
                // I've change the following string; reason:
                // to get a dropped file from the req.files!!!
                file: file, //scope.file,
                type: type,
                name: name,
                size: size,
                x: event.originalEvent.offsetX - docIconSize.width/2,
                y: event.originalEvent.offsetY - docIconSize.height/2
              });
            }
          };
          file = getDataTransfer(event).files[0];
          name = file.name;
          type = file.type;
          size = file.size;
          reader.readAsDataURL(file);
          return false;
        });
      }
    };
  });


